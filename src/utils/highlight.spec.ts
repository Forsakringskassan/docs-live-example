import { highlight } from "./highlight";

it("should be formatted and highlighted", async () => {
    expect.assertions(1);
    const html = `<div class="my-class"><div><p>Lorem ipsum dolor sit amet</p></div></div>`;
    expect(await highlight(html)).toMatchSnapshot();
});
