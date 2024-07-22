import { promises as fs } from 'fs'
import * as theme from 'jsonresume-theme-elegant'
import puppeteer from 'puppeteer'
import { createServer } from 'http-server';
import { render } from 'resumed'
import { create } from 'domain';

const resume = JSON.parse(await fs.readFile('resume.json', 'utf-8'));
await render(resume, theme);

const browser = await puppeteer.launch();
const page = await browser.newPage();

const download = async () => {
    await page.goto(`http://${HOST}/resume.html`, { waitUntil: 'networkidle0' })
    await page.pdf({ path: 'resume.pdf', format: 'a4', printBackground: true })
    await browser.close();
    server.close();
}

var server = createServer({});

const HOST = "localhost";
const PORT = 8080;

server.listen(PORT, HOST, function () {
    console.log(`listening ${PORT}`);
    download();
});
