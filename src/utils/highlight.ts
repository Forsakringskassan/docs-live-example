import { type Options } from "prettier";
import prettier from "prettier/standalone";
import htmlPlugin from "prettier/parser-html";
import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";

hljs.registerLanguage("html", html);

const prettierConfig: Options = {
    parser: "html",
    plugins: [htmlPlugin],
    singleQuote: false,
    arrowParens: "always",
    tabWidth: 4,
    printWidth: 80,
};

/**
 * @internal
 */
export async function highlight(code: string): Promise<string> {
    /* eslint-disable-next-line import/no-named-as-default-member -- technical
     * debt, without actually checking this is probably needed for compatibility
     * with prettier 2 */
    const formatted = await prettier.format(code, prettierConfig);
    const { value } = hljs.highlight(formatted, { language: "html" });
    return `<code class="hljs lang-html" tabindex="0">${value}</code>`;
}
