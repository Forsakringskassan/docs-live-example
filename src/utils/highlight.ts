import * as prettier from "prettier";
import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";

hljs.registerLanguage("html", html);

const prettierConfig: prettier.Options = {
    parser: "html",
    singleQuote: false,
    arrowParens: "always",
    tabWidth: 4,
    printWidth: 80,
};

export async function highlight(code: string): Promise<string> {
    const formatted = await prettier.format(code, prettierConfig);
    const { value } = hljs.highlight(formatted, { language: "html" });
    return `<code class="hljs lang-html" tabindex="0">${value}</code>`;
}
