import { defineComponent, compile, h } from "vue";

export default defineComponent({
    name: "DynamicComponent",
    props: {
        componentScript: { type: Object, required: true },
        template: { type: String, required: true },
    },
    render() {
        const render = compile(this.template);
        return h({ ...this.componentScript, render });
    },
});
