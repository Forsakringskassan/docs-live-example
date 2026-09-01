/**
 * @internal
 */
export function stripComments(html: string): string {
    const commentPattern = /<!--.*?-->/g;
    let previous: string;
    let current = html;

    do {
        previous = current;
        current = current.replace(commentPattern, "");
    } while (current !== previous);

    return current;
}
