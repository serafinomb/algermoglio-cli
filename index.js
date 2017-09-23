#!/usr/bin/env node

const https = require('http');
const cheerio = require('cheerio');
const Table = require('cli-table');

function getHomepage() {
  return new Promise((resolve, reject) => {
    https.get('http://www.algermoglio.it', response => {
      let data = '';

      response.on('data', chunk => data += chunk);
      response.on('end', () => resolve(data));
    }).on('error', reject);
  });
}

getHomepage().then(html => {
  const $ = cheerio.load(html);
  const menu = $('li [style="font-size: xx-small;"] b')
    .contents()
    .map((i, element) => $(element).text())
    .get()
    .map(text => text.trim());

  const richMenu = menu.map(item => {
    const match = item.match(/^(.+) (\d,\d\d)$/i);
    return match ? [match[1], match[2]] : [item, ''];
  });

  const table = new Table({
    head: ['Oggi abbiamo preparato', '€']
  });

  table.push(...richMenu);

  console.log(table.toString());
});
