function cyrb53(str: string): number {
    const a = 2_654_435_761;
    const b = 1_597_334_677;
    const c = 2_246_822_507;
    const d = 3_266_489_909;
    const e = 4_294_967_296;
    const f = 2_097_151;
    const seed = 0;
    let h1 = 0xde_ad_be_ef ^ seed;
    let h2 = 0x41_c6_ce_57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        /* eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- index will be in range */
        ch = str.codePointAt(i)!;
        h1 = Math.imul(h1 ^ ch, a);
        h2 = Math.imul(h2 ^ ch, b);
        i += ch > 0xff_ff ? 2 : 1;
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), c) ^ Math.imul(h2 ^ (h2 >>> 13), d);
    h2 = Math.imul(h2 ^ (h2 >>> 16), c) ^ Math.imul(h1 ^ (h1 >>> 13), d);
    return e * (f & h2) + (h1 >>> 0);
}

/**
 * @internal
 */
export function generateId(template: string): string {
    const hash = cyrb53(template);
    return `le-${hash.toString(16)}`;
}
