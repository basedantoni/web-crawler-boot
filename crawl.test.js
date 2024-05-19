
import { test, expect } from "@jest/globals";
import { normalizeUrl, getURLsFromHTML } from "./crawl";

const expUrl = "blog.boot.dev/path"
const urls = [
    ["https://blog.boot.dev/path/", expUrl],
    ["https://blog.boot.dev/path", expUrl],
    ["http://blog.boot.dev/path/", expUrl],
    ["http://blog.boot.dev/path", expUrl],
    ["http://blog.boot.dev/path///", expUrl],
]


describe("normalizeUrl", () => {
    test.each(urls)(
        "given %p expect %p",
        (url, expectedUrl) => {
            const normalized = normalizeUrl(url)

            expect(normalized).toStrictEqual(expectedUrl)
        }
    );
});

describe("getURLsFromHTML", () => {
    test('returns urls from html', () => {
        const htmlBody = `
            <html>
                <body>
                    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript">Learn JS</a>
                    <a href="https://developer.mozilla.org/en-US/docs/Glossary/DOM">Learn DOM</a>
                    <a href="https://developer.mozilla.org/en-US/docs/Web/API/Popover_API">Learn Popover API</a>
                    <a href="/xyz.html">XYZ</a>
                </body>
            </html>
        `
        const baseURL = "https://developer.mozilla.org"

        const expected = [
            "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            "https://developer.mozilla.org/en-US/docs/Glossary/DOM",
            "https://developer.mozilla.org/en-US/docs/Web/API/Popover_API",
            "https://developer.mozilla.org/xyz.html"
        ]
        const urls = getURLsFromHTML(htmlBody, baseURL)

        expect(urls).toStrictEqual(expected)
        expect(urls.length).toStrictEqual(4)
    })
});