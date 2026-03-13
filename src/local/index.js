import { computed, createApp, defineComponent } from "vue";
import { LiveExample, createElement } from "../../dist/esm/index";

const HelloWorld = defineComponent({
    template: `
        <div style="border:1px solid hotpink;">
            <p>Min vue-komponent</p>
        </div>
	`,
});

createApp({
    components: {
        LiveExample,
    },
    setup() {
        const components = computed(() => {
            return {
                HelloWorld,
            };
        });

        const template = computed(() => {
            return createElement("HelloWorld");
        });

        return {
            components,
            template,
        };
    },
}).mount("#app");
