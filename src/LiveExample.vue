<template>
    <div class="live-example__container">
        <div ref="example" class="live-example__example">
            <live-vue-code v-if="isVue" :components :template :livedata :livemethods></live-vue-code>
            <!-- eslint-disable-next-line vue/no-v-html -- expected to show rendered html -->
            <pre v-else-if="isHtml" v-html="template"></pre>
            <pre v-else>Unknown language, cannot render example</pre>
        </div>
        <div class="live-example__controls">
            <slot></slot>
        </div>
        <div class="live-example__code">
            <div class="live-example__code-toggle">
                <button
                    type="button"
                    class="button button--discrete"
                    :aria-controls="idPrefix + '-code-expand'"
                    :aria-expanded="codeExpand.isOpen ? 'true' : 'false'"
                    @click="onToggleCode"
                >
                    <i class="icon icon--code"></i>
                    {{ codeToggleText }}
                </button>
            </div>
            <div :id="idPrefix + '-code-expand'" ref="expandable" class="collapsed">
                <div class="live-example__code-languages">
                    <fieldset class="fieldset radio-button-group radio-button-group--horizontal">
                        <legend class="label fieldset__label">Kodspråk</legend>
                        <div class="fieldset__content radio-button-group__content">
                            <div v-if="isVue" class="radio-button">
                                <input
                                    :id="idPrefix + '-lang-vue'"
                                    v-model="codeLanguage"
                                    type="radio"
                                    class="radio-button__input"
                                    name="code"
                                    value="vue"
                                />
                                <label :for="idPrefix + '-lang-vue'" class="radio-button__label"> Vue </label>
                            </div>
                            <div class="radio-button">
                                <input
                                    :id="idPrefix + '-lang-html'"
                                    v-model="codeLanguage"
                                    type="radio"
                                    class="radio-button__input"
                                    name="code"
                                    value="html"
                                />
                                <label :for="idPrefix + '-lang-html'" class="radio-button__label"> HTML </label>
                            </div>
                        </div>
                    </fieldset>
                </div>
                <pre ref="template"></pre>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from "vue";
import { highlight, stripComments } from "./utils";
import LiveVueCode from "./live-vue-code";
import { type ExpandAnimation, expandAnimation } from "./expand-animation";

let idCounter = 1;

export default defineComponent({
    name: "LiveExample",
    components: { LiveVueCode },
    props: {
        /**
         * Explicitly render example in given language.
         *
         * Must be one of:
         *
         * - `"vue"` - Interpret `template` as a Vue SFC.
         * - `"html"` - Interpret `template` as vanilla HTML.
         *
         * Default is `"auto"` but you should not explicitly set this value
         * yourself. When set to `"auto"` the contents of `template` prop will
         * be autodetected based on some heurestics (subject to change at any
         * time).
         */
        language: {
            type: String as PropType<"vue" | "html" | "auto">,
            required: false,
            default: "auto",
            validator(value: string): boolean {
                return ["vue", "html", "auto"].includes(value);
            },
        },
        template: {
            type: String,
            required: true,
        },
        components: {
            type: Object,
            required: false,
            default: () => {
                return {};
            },
        },
        livedata: {
            type: Object,
            required: false,
            default: () => {
                return {};
            },
        },
        livemethods: {
            type: Object,
            required: false,
            default: () => {
                return {};
            },
        },
    },
    data() {
        return {
            parentLanguage: "",
            idPrefix: `live-example-${idCounter++}`,
            codeLanguage: "html",
            codeExpand: {
                isOpen: false,
                toggle() {
                    /* do nothing */
                },
            } as ExpandAnimation,
        };
    },
    computed: {
        computedLanguage(): "vue" | "html" {
            /* explicit language set */
            if (this.language !== "auto") {
                return this.language;
            }

            /* autodetect by explicit language attribute on parent */
            if (this.parentLanguage) {
                /* we are lying slightly here, we are only supposed to use these
                two languages but the code will still work even if not: we
                should maybe declare it as "string" instead though */
                return this.parentLanguage as "html" | "vue";
            }

            /* autodetect by legacy method (i.e. it is vue code only when it
             * passes child components) */
            const hasChildComponents = Object.keys(this.components).length > 0;
            return hasChildComponents ? "vue" : "html";
        },
        isVue(): boolean {
            return Object.keys(this.components).length > 0;
        },
        isHtml(): boolean {
            return !this.isVue;
        },
        codeToggleText(): string {
            return this.codeExpand.isOpen ? "Dölj kod" : "Visa kod";
        },
        exampleElement(): HTMLElement {
            return this.$refs.example as HTMLElement;
        },
        expandableElement(): HTMLElement {
            return this.$refs.expandable as HTMLElement;
        },
        templateElement(): HTMLElement {
            return this.$refs.template as HTMLElement;
        },
    },
    watch: {
        template: {
            immediate: false,
            handler() {
                this.compileCode();
            },
        },
        codeLanguage: {
            immediate: false,
            handler() {
                this.compileCode();
            },
        },
    },
    mounted() {
        const parent = this.$el.closest("[data-language]");
        if (parent) {
            this.parentLanguage = parent.dataset.language ?? "";
        }
        if (this.isVue) {
            this.codeLanguage = "vue";
        }

        this.codeExpand = expandAnimation(this.expandableElement);
        this.compileCode();
    },
    methods: {
        onToggleCode(): void {
            this.codeExpand.toggle();
        },
        compileCode(): void {
            switch (this.codeLanguage) {
                case "vue":
                    this.compileVue();
                    break;
                case "html":
                    this.compileHTML();
                    break;
            }
        },
        async compileVue(): Promise<void> {
            const { templateElement } = this;
            templateElement.innerHTML = await highlight(this.template);
        },
        async compileHTML(): Promise<void> {
            await this.$nextTick();
            const { exampleElement, templateElement } = this;
            const html = exampleElement.innerHTML;
            const uncommented = stripComments(html);
            templateElement.innerHTML = await highlight(uncommented);
        },
    },
});
</script>

<style scoped>
.collapsed {
    display: none;
}

.collapsed[aria-expanded="true"] {
    display: block;
}
</style>
