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

var server = createServer({});

server.listen("8080", "localhost", function () {});

await page.goto("http://localhost:8080/resume.html", { waitUntil: 'networkidle0' })
await page.pdf({ path: 'resume.pdf', format: 'a4', printBackground: true })
await browser.close();
server.close();
