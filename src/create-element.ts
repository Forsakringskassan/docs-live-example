import { toKebabCase } from "./utils";

export type PlainValue = string | number | boolean | null | undefined;

export interface Attributes {
    [key: string]: PlainValue | PlainValue[] | Attributes;
}

export type Children = string | string[];

const voidElements = [
    "area",
    "base",
    "br",
    "col",
    "embed",
    "hr",
    "img",
    "input",
    "link",
    "meta",
    "param",
    "source",
    "track",
    "wbr",
];

function unpackArgs(
    args:
        | []
        | [children: string | string[]]
        | [attrs: Attributes]
        | [attrs: Attributes, children: string | string[]],
): { attributes: Attributes; children: string[] } {
    if (args.length === 0) {
        return { attributes: {}, children: [] };
    }
    if (args.length === 1) {
        const [arg0] = args;
        if (typeof arg0 === "string") {
            return { attributes: {}, children: [arg0] };
        } else if (Array.isArray(arg0)) {
            return { attributes: {}, children: arg0 };
        } else {
            return { attributes: arg0, children: [] };
        }
    }
    const [arg0, arg1] = args;
    return { attributes: arg0, children: Array.isArray(arg1) ? arg1 : [arg1] };
}

function serializeChildren(children: string[]): string {
    if (children.length > 0) {
        return ` ${children.join(" ")} `;
    } else {
        return "";
    }
}

function serializeAttribute(
    key: string,
    value: PlainValue | PlainValue[] | Attributes,
    prefix: string = "",
): string | string[] {
    if (Array.isArray(value)) {
        const tokens = value
            .map((it) => (it ? String(it) : null))
            .filter(Boolean);
        if (tokens.length > 0) {
            return `${prefix}${key}="${tokens.join(" ")}"`;
        } else {
            return [];
        }
    }
    if (value === null || value === undefined) {
        return [];
    }
    if (typeof value === "string" || typeof value === "number") {
        return `${prefix}${key}="${String(value)}"`;
    }
    if (typeof value === "boolean") {
        return value ? `${prefix}${key}` : [];
    }
    return Object.entries(value)
        .map(([nestedKey, value]) => {
            return serializeAttribute(nestedKey, value, `${prefix}${key}-`);
        })
        .flat()
        .filter(Boolean);
}

function serializeAttributes(attrs: Attributes): string {
    const entries = Object.entries(attrs);
    const kv = entries.map(([key, value]) =>
        serializeAttribute(toKebabCase(key), value),
    );
    const flat = kv.flat();
    if (flat.length > 0) {
        return ` ${kv.flat().join(" ")}`;
    } else {
        return "";
    }
}

/* eslint-disable @typescript-eslint/unified-signatures -- technical debt */
export function createElement(tagName: string): string;
export function createElement(tagName: string, children: Children): string;
export function createElement(tagName: string, attrs: Attributes): string;
export function createElement(
    tagName: string,
    attrs: Attributes,
    children: Children,
): string;
/* eslint-enable @typescript-eslint/unified-signatures */
export function createElement(
    tagName: string,
    ...args:
        | []
        | [children: string | string[]]
        | [attrs: Attributes]
        | [attrs: Attributes, children: string | string[]]
): string {
    const { attributes, children } = unpackArgs(args);
    const attrs = serializeAttributes(attributes);

    if (voidElements.includes(tagName)) {
        return `<${tagName}${attrs}>`;
    } else {
        const content = serializeChildren(children);
        return `<${tagName}${attrs}>${content}</${tagName}>`;
    }
}
