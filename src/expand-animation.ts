import { ref } from "vue";

export interface ExpandAnimation {
    readonly isOpen: boolean;
    toggle(): void;
}

const DURATION = 400; /* ms */

const ClassNames = {
    EXPANDING: "expanding",
    COLLAPSING: "collapsing",
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion)");
let useAnimation = !prefersReducedMotion.matches;

prefersReducedMotion.addEventListener("change", (event) => {
    useAnimation = !event.matches;
});

export function expandAnimation(element: HTMLElement): ExpandAnimation {
    let animation: Animation | null = null;
    const isOpen = ref(false);
    let isClosing = false;
    let isExpanding = false;

    return {
        get isOpen() {
            return isOpen.value;
        },
        toggle() {
            if (useAnimation) {
                element.style.overflow = "hidden";
                if (isExpanding || isOpen.value) {
                    isOpen.value = false;
                    shrink();
                    /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- technical debt */
                } else if (isClosing || !isOpen.value) {
                    isOpen.value = true;
                    open();
                }
                return;
            }

            if (isOpen.value) {
                isOpen.value = false;
                element.setAttribute("aria-expanded", "false");
            } else {
                isOpen.value = true;
                element.setAttribute("aria-expanded", "true");
            }
        },
    };

    function shrink(): void {
        isClosing = true;

        const startHeight = `${String(element.offsetHeight)}px`;
        const endHeight = `0px`;

        element.classList.add(ClassNames.COLLAPSING);

        if (animation) {
            animation.cancel();
        }

        animation = element.animate(
            {
                height: [startHeight, endHeight],
            },
            {
                duration: DURATION,
                easing: "ease-in-out",
            },
        );

        animation.onfinish = () => {
            onAnimationFinish(false);
        };

        animation.addEventListener("cancel", () => {
            element.classList.remove(ClassNames.COLLAPSING);
            isClosing = false;
        });
    }

    function open(): void {
        let currentHeight = 0;
        if (animation) {
            currentHeight = element.getBoundingClientRect().height;
        }
        element.setAttribute("aria-expanded", "true");
        window.requestAnimationFrame(() => {
            expand(currentHeight);
        });
    }

    function expand(currentHeight: number): void {
        isExpanding = true;

        if (animation) {
            animation.cancel();
            element.style.height = "";
        }

        const startHeight = `${String(currentHeight)}px`;
        const endHeight = `${String(element.offsetHeight)}px`;

        element.classList.add(ClassNames.EXPANDING);

        animation = element.animate(
            {
                height: [startHeight, endHeight],
            },
            {
                duration: DURATION,
                easing: "ease-in-out",
            },
        );

        animation.onfinish = () => {
            onAnimationFinish(true);
        };

        animation.addEventListener("cancel", () => {
            element.classList.remove(ClassNames.EXPANDING);
            isExpanding = false;
        });
    }

    function onAnimationFinish(open: boolean): void {
        element.setAttribute("aria-expanded", open ? "true" : "false");
        animation = null;
        isClosing = false;
        isExpanding = false;
        element.classList.remove(ClassNames.EXPANDING);
        element.classList.remove(ClassNames.COLLAPSING);
        element.style.height = "";
        element.style.overflow = "";
    }
}
