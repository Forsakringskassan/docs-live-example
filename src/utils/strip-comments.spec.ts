import { stripComments } from "./strip-comments";

it("should remove comments", () => {
    expect.assertions(1);
    const html = /* HTML */ `
        <div class="my-class">
            <!-- I am a comment! -->
            <!--v-if-->
            <!---->
        </div>
    `;
    expect(stripComments(html)).toMatchSnapshot();
});

it("should remove comments that contain tags", () => {
    expect.assertions(1);
    const html = /* HTML */ `<!-- foo <div> bar -->`;
    expect(stripComments(html)).toBe("");
});
