import { crawlPageR } from "./crawl.js";
import { printReport } from "./report.js";
import { argv } from "node:process";

async function main() {
    const args = argv.slice(2)
  
    if (args.length < 1 || args.length > 1) {
        console.error("Web Scraper CLI only accepts exactly 1 argument")
        process.exit(1)
    }

    console.log("Starting with base URL:", args[0])
    const pages = await crawlPageR(args[0])

    printReport(pages)
}

main()
  