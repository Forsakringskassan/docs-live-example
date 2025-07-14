import { toKebabCase } from "./to-kebab-case";

it("should convert strings to kebab-case", () => {
    expect.assertions(1);
    const inputWords = [
        "PascalCase",
        "camelCase",
        "snake_case",
        "kebab-case",
        "alllowercase",
        "ALLCAPITALLETTERS",
        "StartMIDDLEEnd",
        "STARTEnd",
        "STARTMiddleEnd",
        "Start99End",
        "StartMiddle00End",
    ];
    const expected = [
        "pascal-case",
        "camel-case",
        "snake_case",
        "kebab-case",
        "alllowercase",
        "allcapitalletters",
        "start-middle-end",
        "start-end",
        "start-middle-end",
        "start99-end",
        "start-middle00-end",
    ];
    const result = inputWords.map((word) => toKebabCase(word));
    expect(result).toEqual(expected);
});
