import { JSDOM } from "jsdom"

export const normalizeUrl = (url) => {
    const myUrl = new URL(url);
    
    return myUrl.host + myUrl.pathname.replace(/\/+$/, "")
}

/**
 * Returns list of unormalized urls from an HTML string
 * @param {string} htmlBody - HTML string
 * @param {string} baseURL - Root URL of website being crawled
 * @returns {Array} urls - Unormalized urls
 */
export const getURLsFromHTML = (htmlBody, baseURL) => {
    const dom = new JSDOM(htmlBody);
    const anchors = dom.window.document.querySelectorAll('a')
    const urls = []

    anchors.forEach((anchor) => {
        let href = anchor.href;

        if (href[0] === "/") {
            urls.push(baseURL + href)
            return
        }
        urls.push(href)
    })

    return urls
}

/**
 * Crawls a given webpage
 * @param {string} currentURL
 * @returns {void}
 */
export const crawlPageR = async (baseURL, currentURL = baseURL, pages = {}) => {
    if (baseURL === "" || currentURL === "") {
        return pages
    }
    
    const newBaseURL = new URL(baseURL)
    const newCurrentURL = new URL(currentURL)

    if (newBaseURL.hostname !== newCurrentURL.hostname) {
        return pages
    }

    const normalizedCurrentURL = normalizeUrl(currentURL)

    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log('Actively Crawling:', currentURL)

    const html = await crawlPageWithRetries(currentURL)
    const urls = getURLsFromHTML(html, baseURL)

    for (const url of urls) {
        await crawlPageR(baseURL, url, pages)
    }

    return pages;
}

const crawlPageWithRetries = async (currentURL, retries = 3) => {
    for (let i = 0; i < retries; i++) {
        try {
            const resp = await fetch(currentURL);
            if (resp.status > 399) {
                console.error("HTTP request returned with status code:", resp.status)
                return
            }
            if (!resp.headers.get('content-type').includes("text/html")) {
                console.error("Response must be Content-Type: text/html")
                return
            }
    
            const html = await resp.text()
    
            return html
        } catch (error) {
            console.error(`Attempt ${i + 1} failed for ${currentURL}:`, error);
            if (i < retries - 1) {
                await new Promise(resolve => setTimeout(resolve, 5000)); // Add delay before retrying
            }
            return
        }
    }
}