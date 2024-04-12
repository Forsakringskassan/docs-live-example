import { defineComponent, compile, h } from "vue";

export default defineComponent({
    name: "LiveCode",
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