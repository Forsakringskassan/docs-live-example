declare module "prettier-2/parser-html" {
    /* @ts-expect-error -- temporary until prettier 3 is supported by this lib */
    import { Plugin } from "@types/prettier";

    const value: Plugin;
    export default value;
}
