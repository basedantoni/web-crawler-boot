export const printReport = (pages) => {
    console.log("Report is starting...")

    const sortedKeys = Object.keys(pages).sort((a, b) => pages[b] - pages[a]);
    console.log("+-------------------------------+")
    sortedKeys.forEach(key => {
        console.log(`Found ${pages[key]} internal links to ${key}`)
    });
    console.log("+-------------------------------+")
}