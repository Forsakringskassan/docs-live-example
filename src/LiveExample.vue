<template>
    <div class="live-example__container">
        <div ref="example" class="live-example__example">
            <div v-if="templateLanguage === 'vue'">
                <dynamic-component
                    v-if="examples"
                    :component="currentExample.component"
                    :template-markdown="template"
                ></dynamic-component>
                <live-vue-code v-else :components :template :livedata :livemethods></live-vue-code>
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -- expected to show rendered html -->
            <div v-else-if="templateLanguage === 'html'" v-html="template"></div>
            <div v-else><pre>Unknown language, cannot render example</pre></div>
        </div>

        <div class="live-example__controls">
            <slot></slot>
        </div>

        <div v-if="exampleElement" class="live-example__code">
            <live-example-sourcecode
                :element="exampleElement"
                :template="fullTemplate"
                :template-language
                :examples
                @change="onVariantChange"
            ></live-example-sourcecode>
        </div>
    </div>
</template>

<script lang="ts">
import { type PropType, defineComponent } from "vue";
import LiveExampleSourcecode from "./LiveExampleSourcecode.vue";
import LiveVueCode from "./live-vue-code";
import DynamicComponent from "./DynamicComponent";

export interface LiveExampleVariant {
    displayName: string;
    component: object;
    scriptMarkdown: string;
    language: "vue" | "html";
}

export default defineComponent({
    name: "LiveExample",
    components: { LiveExampleSourcecode, LiveVueCode, DynamicComponent },
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
        examples: {
            type: Array<LiveExampleVariant>,
            requred: false,
            default: () => {
                return undefined;
            },
        },
    },
    data() {
        return {
            /** Language declared by parent element via `data-language`, if any */
            parentLanguage: "",
            exampleElement: undefined as HTMLElement | undefined,
            currentExample: {} as LiveExampleVariant,
        };
    },
    computed: {
        templateLanguage(): "vue" | "html" {
            /* explicit language set */
            if (this.language !== "auto") {
                return this.language;
            }

            /* autodetect by explicit language attribute on parent */
            if (this.parentLanguage) {
                /* we are lying slightly here, we are only supposed to use these
                 * two languages but the code will still work even if not: we
                 * should maybe declare it as "string" instead though */
                return this.parentLanguage as "html" | "vue";
            }

            /* autodetect by legacy method (i.e. it is vue code only when it
             * passes child components) */
            const hasChildComponents = Object.keys(this.components).length > 0;
            return hasChildComponents ? "vue" : "html";
        },
        fullTemplate(): string {
            if (this.currentExample.scriptMarkdown) {
                const scriptMarkdown = this.currentExample.scriptMarkdown.replace(/<template>[\s\S]*<\/template>/, "");
                return `<template>${this.template}</template>\n\n${scriptMarkdown}`;
            } else {
                return this.template;
            }
        },
    },
    mounted() {
        if (this.examples && this.examples.length > 0) {
            this.currentExample = this.examples[0];
        }
        /* try to fetch template language from a parent element */
        const parent = this.$el.closest("[data-language]");
        if (parent) {
            this.parentLanguage = parent.dataset.language ?? "";
        }

        this.exampleElement = this.$refs.example as HTMLElement;
    },
    methods: {
        onVariantChange(example: LiveExampleVariant) {
            this.currentExample = example;
        },
    },
});
</script>
