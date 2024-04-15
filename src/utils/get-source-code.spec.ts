import { getSourceCode } from "./get-source-code";

const template = "original source code";
let element: { innerHTML: string };

beforeEach(() => {
    element = { innerHTML: /* HTML */ `<p>rendered source code</p>` };
});

it('should return original template when language is "original"', async () => {
    expect.assertions(1);
    const result = await getSourceCode({
        language: "original",
        template,
        element,
    });
    expect(result).toMatchInlineSnapshot(`
        "<code class="hljs lang-html" tabindex="0">original source code
        </code>"
    `);
});

it('should return rendered template when language is "rendered"', async () => {
    expect.assertions(1);
    const result = await getSourceCode({
        language: "rendered",
        template,
        element,
    });
    expect(result).toMatchInlineSnapshot(`
        "<code class="hljs lang-html" tabindex="0"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>rendered source code<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
        </code>"
    `);
});

it("should strip html comments from rendered template", async () => {
    expect.assertions(1);
    element.innerHTML = /* HTML */ `
        <!-- foobar -->
        <p>lorem ipsum</p>
    `;
    const result = await getSourceCode({
        language: "rendered",
        template,
        element,
    });
    expect(result).toMatchInlineSnapshot(`
        "<code class="hljs lang-html" tabindex="0"><span class="hljs-tag">&lt;<span class="hljs-name">p</span>&gt;</span>lorem ipsum<span class="hljs-tag">&lt;/<span class="hljs-name">p</span>&gt;</span>
        </code>"
    `);
});
