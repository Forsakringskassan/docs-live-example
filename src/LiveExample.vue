<template>
    <div class="live-example__container">
        <div ref="example" class="live-example__example">
            <live-code
                :components="components"
                :template="template"
                :livedata="livedata"
                :livemethods="livemethods"
            ></live-code>
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
import { defineComponent } from "vue";
import { highlight, stripComments } from "./utils";
import LiveCode from "./LiveCode";
import { type ExpandAnimation, expandAnimation } from "./expand-animation";

let idCounter = 1;

export default defineComponent({
    name: "LiveExample",
    components: { LiveCode },
    props: {
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
        isVue(): boolean {
            return Object.keys(this.components).length > 0;
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
