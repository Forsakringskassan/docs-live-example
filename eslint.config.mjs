import defaultConfig, { defineConfig } from "@forsakringskassan/eslint-config";
import cliConfig from "@forsakringskassan/eslint-config-cli";
import typescriptConfig from "@forsakringskassan/eslint-config-typescript";
import typeinfoConfig from "@forsakringskassan/eslint-config-typescript-typeinfo";
import jestConfig from "@forsakringskassan/eslint-config-jest";
import vueConfig from "@forsakringskassan/eslint-config-vue";

export default [
    defineConfig({
        name: "Ignored files",
        ignores: [
            "**/coverage/**",
            "**/dist/**",
            "**/node_modules/**",
            "**/temp/**",
        ],
    }),

    ...defaultConfig,

    cliConfig({
        files: ["**/*.{js,ts,mjs}"],
    }),
    typescriptConfig(),
    typeinfoConfig(import.meta.dirname),
    jestConfig(),
    vueConfig(),

    defineConfig({
        name: "local/technical-debt",
        files: ["**/*.{cjs,mjs}"],
        rules: {
            "import/extensions": "off",
            "import/no-unresolved": "off",
            "import/no-named-as-default-member": "off",
        },
    }),
];
