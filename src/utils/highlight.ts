import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
import { type Options } from "prettier";
import htmlPlugin from "prettier/plugins/html";
import { format } from "prettier/standalone";

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
    const formatted = await format(code, prettierConfig);
    const { value } = hljs.highlight(formatted, { language: "html" });
    return `<code class="hljs lang-html" tabindex="0">${value}</code>`;
}
