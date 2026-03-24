<script setup lang="ts">
import { computed, nextTick, onMounted, ref, useTemplateRef, watch } from "vue";
import { type ExpandAnimation, expandAnimation } from "./expand-animation";
import { generateId, getSourceCode } from "./utils";

const props = defineProps<{
    element: HTMLElement;
    template: string;
    templateLanguage: "vue" | "html";
}>();

let idPrefix = generateId(props.template);
const sourcecode = ref("");
const expandable = useTemplateRef("expandableRef");
const animation = ref<ExpandAnimation>({
    isOpen: false,
    toggle() {
        /* do nothing */
    },
});
const selectedLanguage = ref(toSelectedLanguage(props.templateLanguage));

const codeToggleText = computed(() => {
    return animation.value.isOpen ? "Dölj kod" : "Visa kod";
});

onMounted(() => {
    if (expandable.value) {
        animation.value = expandAnimation(expandable.value);
    } else {
        throw new Error("Missing HTML element");
    }
    updateSourcecode();
});

watch(() => props.template, onUpdateTemplate);
watch(() => props.templateLanguage, updateSelectedLanguage, { once: true });

async function updateSourcecode(): Promise<void> {
    await nextTick();
    sourcecode.value = await getSourceCode({
        language: selectedLanguage.value,
        template: props.template ?? "",
        element: unwrapElement(props.element),
    });
}

/**
 * Returns the first child of the element.
 */
function unwrapElement(element: HTMLElement): HTMLElement {
    const firstElementChild = element.firstElementChild as HTMLElement | undefined;
    return firstElementChild ?? element;
}

function updateSelectedLanguage(value: "html" | "vue"): void {
    selectedLanguage.value = toSelectedLanguage(value);
}

function id(suffix: string): string {
    return `${idPrefix}--${suffix}`;
}

function toSelectedLanguage(value: "html" | "vue"): "original" | "rendered" {
    return value === "html" ? "rendered" : "original";
}

function onUpdateTemplate(template: string): void {
    idPrefix = generateId(template);
    updateSourcecode();
}

function onToggleCode(): void {
    animation.value.toggle();
}
</script>

<template>
    <div class="live-example__code-toggle">
        <button
            type="button"
            class="button button--discrete"
            :aria-controls="id('code-expand')"
            :aria-expanded="animation.isOpen ? 'true' : 'false'"
            @click="onToggleCode"
        >
            <svg focusable="false" class="icon" aria-hidden="true">
                <use href="#live-example-icon-code"></use>
            </svg>
            {{ codeToggleText }}
        </button>
    </div>
    <div :id="id('code-expand')" ref="expandableRef" class="collapsed">
        <!-- [html-validate-disable-next wcag/h32 -- this form is not meant to be submitted] -->
        <form class="live-example__code-languages" onsubmit="event.preventDefault()">
            <fieldset v-if="sourcecode" class="fieldset radio-button-group radio-button-group--horizontal">
                <legend class="label fieldset__label">Kodspråk</legend>
                <div class="fieldset__content radio-button-group__content">
                    <div v-if="templateLanguage === 'vue'" class="radio-button">
                        <input
                            :id="id('lang-original')"
                            v-model="selectedLanguage"
                            type="radio"
                            class="radio-button__input"
                            name="selected-language"
                            value="original"
                            @change="updateSourcecode"
                        />
                        <label :for="id('lang-original')" class="radio-button__label"> Vue </label>
                    </div>
                    <div class="radio-button">
                        <input
                            :id="id('lang-rendered')"
                            v-model="selectedLanguage"
                            type="radio"
                            class="radio-button__input"
                            name="selected-language"
                            value="rendered"
                            @change="updateSourcecode"
                        />
                        <label :for="id('lang-rendered')" class="radio-button__label"> HTML </label>
                    </div>
                </div>
            </fieldset>
        </form>
        <!-- eslint-disable-next-line vue/no-v-html -- expected to show highlighted markup -->
        <pre v-html="sourcecode"></pre>
    </div>

    <div aria-hidden="true" style="display: none">
        <svg xmlns="http://www.w3.org/2000/svg" focusable="false">
            <symbol id="live-example-icon-code" viewBox="0 0 512 512">
                <path
                    fill="currentColor"
                    d="M200 354L102 256L200 158L171 128L43 256L171 384L200 354ZM312 354L410 256L312 158L341 128L469 256L341 384L312 354Z"
                />
            </symbol>
        </svg>
    </div>
</template>

<style scoped>
.collapsed {
    display: none;
}

.collapsed[aria-expanded="true"] {
    display: block;
}
</style>
