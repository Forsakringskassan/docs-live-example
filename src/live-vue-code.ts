import { defineComponent, compile, h } from "vue";

export default defineComponent({
    name: "LiveVueCode",
    props: {
        template: {
            type: String,
            required: true,
        },
        components: {
            type: Object,
            required: true,
        },
        livedata: {
            type: Object,
            required: true,
        },
        livemethods: {
            type: Object,
            required: true,
        },
    },
    render() {
        const renderFunction = compile(this.template);
        /* eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- technical debt */
        if (!renderFunction) {
            const message = "Failed to compile Vue render function!";
            return h("div", { style: "color: red" }, message);
        }
        return h(
            {
                name: "LiveComponent",
                data() {
                    return { ...this.livedata };
                },
                props: {
                    livedata: {
                        type: Object,
                        required: true,
                    },
                    livemethods: {
                        type: Object,
                        required: true,
                    },
                },
                methods: { ...this.livemethods },
                components: this.components,
                render: renderFunction,
            },
            { livedata: this.livedata, livemethods: this.livemethods },
        );
    },
});
