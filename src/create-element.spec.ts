import { createElement } from "./create-element";

it("should serialize element", () => {
    expect.assertions(1);
    const markup = createElement("div");
    expect(markup).toMatchInlineSnapshot(`"<div></div>"`);
});

it("should serialize void element", () => {
    expect.assertions(1);
    const markup = createElement("input");
    expect(markup).toMatchInlineSnapshot(`"<input>"`);
});

it("should serialize element with string attribute", () => {
    expect.assertions(1);
    const markup = createElement("div", { id: "foo" });
    expect(markup).toMatchInlineSnapshot(`"<div id="foo"></div>"`);
});

it("should serialize element with numeric attribute", () => {
    expect.assertions(1);
    const markup = createElement("select", { size: 10 });
    expect(markup).toMatchInlineSnapshot(`"<select size="10"></select>"`);
});

it("should serialize element with boolean", () => {
    expect.assertions(1);
    const markup = createElement("input", { readonly: false, disabled: true });
    expect(markup).toMatchInlineSnapshot(`"<input disabled>"`);
});

it("should serialize element with array", () => {
    expect.assertions(1);
    const markup = createElement("div", { class: ["foo", "bar", "baz"] });
    expect(markup).toMatchInlineSnapshot(`"<div class="foo bar baz"></div>"`);
});

it("should serialize element with object attribute", () => {
    expect.assertions(1);
    const markup = createElement("div", {
        data: { foo: "1", bar: ["2", "3"], baz: 1, flux: true },
    });
    expect(markup).toMatchInlineSnapshot(
        `"<div data-foo="1" data-bar="2 3" data-baz="1" data-flux></div>"`,
    );
});

it("should serialize element with deeply nested object attribute", () => {
    expect.assertions(1);
    const markup = createElement("div", {
        data: { foo: { bar: { baz: "spam" } } },
    });
    expect(markup).toMatchInlineSnapshot(
        `"<div data-foo-bar-baz="spam"></div>"`,
    );
});

it("should strip null and undefined attributes", () => {
    expect.assertions(1);
    const markup = createElement("div", {
        foo: undefined,
        bar: null,
        baz: [null, undefined],
        ham: {
            a: null,
            b: undefined,
            c: {
                d: undefined,
            },
        },
    });
    expect(markup).toMatchInlineSnapshot(`"<div></div>"`);
});

it("should strip empty string from array attribute", () => {
    expect.assertions(1);
    const markup = createElement("div", {
        class: [""],
    });
    expect(markup).toMatchInlineSnapshot(`"<div></div>"`);
});

it("should retain empty string from string attribute", () => {
    expect.assertions(1);
    const markup = createElement("div", {
        foo: "",
    });
    expect(markup).toMatchInlineSnapshot(`"<div foo=""></div>"`);
});

it("should strip empty object", () => {
    expect.assertions(1);
    const markup = createElement("div", { data: {}, foo: { bar: {} } });
    expect(markup).toMatchInlineSnapshot(`"<div></div>"`);
});

it("should serialize element with text content", () => {
    expect.assertions(1);
    const markup = createElement("div", "lorem ipsum");
    expect(markup).toMatchInlineSnapshot(`"<div> lorem ipsum </div>"`);
});

it("should serialize element with element child", () => {
    expect.assertions(1);
    const markup = createElement("div", createElement("p", "lorel ipsum"));
    expect(markup).toMatchInlineSnapshot(`"<div> <p> lorel ipsum </p> </div>"`);
});

it("should serialize element with multple child nodes", () => {
    expect.assertions(1);
    const markup = createElement("div", [
        "lorem ipsum",
        createElement("em", "dolor"),
        "sit amet",
    ]);
    expect(markup).toMatchInlineSnapshot(
        `"<div> lorem ipsum <em> dolor </em> sit amet </div>"`,
    );
});

it("should serialize element with both attributes and text content", () => {
    expect.assertions(1);
    const markup = createElement("div", { class: "foo" }, "lorem ipsum");
    expect(markup).toMatchInlineSnapshot(
        `"<div class="foo"> lorem ipsum </div>"`,
    );
});

it("should serialize element with both attributes and multiple elements", () => {
    expect.assertions(1);
    const markup = createElement("div", { class: "foo" }, [
        createElement("h1", "lorem"),
        createElement("p", "ipsum"),
        "dolor sit amet",
    ]);
    expect(markup).toMatchInlineSnapshot(
        `"<div class="foo"> <h1> lorem </h1> <p> ipsum </p> dolor sit amet </div>"`,
    );
});
