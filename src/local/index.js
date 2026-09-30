import { computed, createApp, ref } from "vue";
import { LiveExample, createElement } from "../../dist/esm/index";

createApp({
    components: {
        LiveExample,
    },
    setup() {
        const tagName = ref("div");
        const placeholderText = ref(false);

        const template = computed(() => {
            const message = placeholderText.value
                ? "Lorem ipsum dolor sit amet"
                : "Hello World!";
            return createElement(tagName.value, message);
        });

        return {
            tagName,
            placeholderText,
            template,
        };
    },
}).mount("#app");
