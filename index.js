import { promises as fs } from 'fs'
import * as theme from 'jsonresume-theme-elegant'
import puppeteer from 'puppeteer'
import { createServer } from 'http-server';
import { render } from 'resumed'

const HOST = "localhost";
const PORT = 8080;

const createHTML = async () => {
    const resume = JSON.parse(await fs.readFile('resume.json', 'utf-8'));
    const rendered = await render(resume, theme);
    await fs.writeFile("resume.html", rendered);
}

const createPDF = async (server) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`http://${HOST}:${PORT}/resume.html`, { waitUntil: 'networkidle0' })
    await page.pdf({ path: 'resume.pdf', format: 'a4', printBackground: true })
    await browser.close();
    server.close();
}

const runServer = async () => {
    const server = createServer({});
    server.listen(PORT, HOST, async () => {
        console.log(`listening ${PORT}`);
        await createPDF(server);
    });
}

createHTML();
runServer();
createPDF();
