import { defineComponent, compile, h } from "vue";

export default defineComponent({
    name: "DynamicComponent",
    props: {
        component: { type: Object, required: true },
        templateMarkdown: { type: String, required: true },
    },
    render() {
        console.log("DynamicComponent render:", this.templateMarkdown);
        console.log("DynamicComponent component", this.component);
        const render = compile(this.templateMarkdown);
        this.component.render = render;
        return h(this.component);
    },
});
