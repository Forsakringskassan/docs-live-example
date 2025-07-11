/**
 * @internal
 */
export function toKebabCase(input: string): string {
    return input.replace(
        /[A-Z]+(?![a-z])|[A-Z]/g,
        ($, ofs) => (ofs ? "-" : "") + $.toLowerCase(),
    );
}
