<script lang="ts">
import { type PropType, defineComponent } from "vue";
import LiveExampleSourcecode from "./LiveExampleSourcecode.vue";
import LiveVueCode from "./live-vue-code";

export default defineComponent({
    name: "LiveExample",
    components: { LiveExampleSourcecode, LiveVueCode },
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
        forceSingleColumn: {
            type: Boolean,
            required: false,
        },
    },
    data() {
        return {
            /** Language declared by parent element via `data-language`, if any */
            parentLanguage: "",
            exampleElement: undefined as HTMLElement | undefined,
        };
    },
    computed: {
        containerClasses(): string[] {
            const classes = ["live-example__container"];
            if (this.forceSingleColumn) {
                classes.push("live-example__container--single-column");
            }
            return classes;
        },
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
    },
    mounted() {
        /* try to fetch template language from a parent element */
        const parent = this.$el.closest("[data-language]");
        if (parent) {
            this.parentLanguage = parent.dataset.language ?? "";
        }

        this.exampleElement = this.$refs.example as HTMLElement;
    },
});
</script>

<template>
    <div :class="containerClasses">
        <div ref="example" class="live-example__example user-background">
            <div v-if="templateLanguage === 'vue'">
                <live-vue-code :components :template :livedata :livemethods></live-vue-code>
            </div>
            <!-- eslint-disable-next-line vue/no-v-html -- expected to show rendered html -->
            <div v-else-if="templateLanguage === 'html'" v-html="template"></div>
            <div v-else><pre>Unknown language, cannot render example</pre></div>
        </div>
        <div class="live-example__controls">
            <slot></slot>
        </div>
        <div v-if="exampleElement" class="live-example__code">
            <live-example-sourcecode :element="exampleElement" :template :template-language></live-example-sourcecode>
        </div>
    </div>
</template>
