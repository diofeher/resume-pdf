import { promises as fs } from 'fs'
import * as theme from 'jsonresume-theme-elegant'
import puppeteer from 'puppeteer'
import { createServer } from 'http-server';
import { render } from 'resumed'

const resume = JSON.parse(await fs.readFile('resume.json', 'utf-8'));
const rendered = await render(resume, theme);
await fs.writeFile("resume.html", rendered);

const browser = await puppeteer.launch();
const page = await browser.newPage();

const download = async () => {
    console.log("downloading");
    await page.goto(`http://${HOST}:${PORT}/resume.html`, { waitUntil: 'networkidle0' })
    console.log("go to the page");
    await page.pdf({ path: 'resume.pdf', format: 'a4', printBackground: true })
    console.log("close the browser");
    await browser.close();
    console.log("close the server");
    server.close();
}

var server = createServer({});

const HOST = "localhost";
const PORT = 8080;

server.listen(PORT, HOST, function () {
    console.log(`listening ${PORT}`);
    download();
});
