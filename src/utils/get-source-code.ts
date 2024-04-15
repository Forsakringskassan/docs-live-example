import { highlight } from "./highlight";
import { stripComments } from "./strip-comments";

/**
 * @internal
 */
export interface SourceCodeOptions {
    /** Whenever to get the original sourcecode (as passed into live-example component) or the rendered final HTML */
    readonly language: "original" | "rendered";

    /** Original template (sourcecode as passed into live-example component) */
    readonly template: string;

    /** The element containing the running example */
    readonly element: { readonly innerHTML: string };
}

/**
 * @internal
 */
export async function getSourceCode(
    options: SourceCodeOptions,
): Promise<string> {
    const { language, template, element } = options;
    if (language === "original") {
        return await highlight(template);
    } else {
        const html = element.innerHTML;
        const uncommented = stripComments(html);
        return await highlight(uncommented);
    }
}
