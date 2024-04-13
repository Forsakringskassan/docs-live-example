/**
 * @internal
 */
export function stripComments(html: string): string {
    const commentPattern = /<!--.*?-->/g;
    return html.replace(commentPattern, "");
}
