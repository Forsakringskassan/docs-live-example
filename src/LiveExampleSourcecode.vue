<script setup lang="ts">
import { type PropType, ref, computed, onMounted, watch, nextTick } from "vue";
import { type ExpandAnimation, expandAnimation } from "./expand-animation";
import { generateId, getSourceCode } from "./utils";
import { LiveExampleVariant } from "./LiveExample.vue";

const props = defineProps({
    element: {
        type: HTMLElement,
        required: true,
    },
    template: {
        type: String,
        required: true,
    },
    templateLanguage: {
        type: String as PropType<"vue" | "html">,
        required: true,
    },
    examples: {
        type: Array<LiveExampleVariant>,
        requred: false,
        default: () => {
            return undefined;
        },
    },
});

const emit = defineEmits(["change"]);

let idPrefix = generateId(props.template);
const selectedExample = ref<LiveExampleVariant>();
const sourcecode = ref("");
const expandable = ref<HTMLElement | null>(null);
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
    if (props.examples) {
        selectedExample.value = props.examples[0];
    }
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

async function onVariantChange(): Promise<void> {
    emit("change", selectedExample.value);
    await updateSourcecode();
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
            <i class="icon icon--code"></i>
            {{ codeToggleText }}
        </button>
    </div>
    <div :id="id('code-expand')" ref="expandable" class="collapsed">
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
            <div v-if="props.examples" class="select-field">
                <label class="label" :for="id('lang-dropplista')"> Variant </label>
                <div class="select-field__icon-wrapper">
                    <select
                        :id="id('lang-dropplista')"
                        v-model="selectedExample"
                        class="select-field__select"
                        @change="onVariantChange"
                    >
                        <option v-for="example in props.examples" :key="example.displayName" :value="example">
                            {{ example.displayName }}
                        </option>
                    </select>
                </div>
            </div>
        </form>
        <!-- eslint-disable-next-line vue/no-v-html -- expected to show highlighted markup -->
        <pre v-html="sourcecode"></pre>
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
