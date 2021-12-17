import got from 'got';
import cheerio from 'cheerio';

const AO3Query = 'https://archiveofourown.org/works/';
const ao3Regex = /https:\/\/archiveofourown\.org\/works\/(\d+)/;

export function getWorkId(url: string): string {
  if (!url.match(ao3Regex)) throw new Error('Invalid AO3 URL');
  return url.replace(AO3Query, '').split(/\/|\?|#/)[0] || '';
}

export interface Work {
  id: string;
  title: string;
  rating: string;
  warnings: string[];
  categories: string[];
  relationships: string[];
  characters: string[];
  tags: string[];
  language: string;
  series?: {
    id: string;
    title: string;
  };
  stats: {
    published: Date;
    updated: Date;
    words: number;
    chapters: [current: number, total: number];
    kudos: number;
    bookmarks: number;
    hits: number;
  };
}
export async function getWork(id: string): Promise<Work> {
  const response = await got(`${AO3Query}${id}`);
  const html = response.body;
  const $ = cheerio.load(html);

  const series = $(
    '#main > div.work > div.wrapper > dl > dd.series > span > span.position > a'
  );
  const stats = $('#main > div.work > div.wrapper > dl > dd.stats > dl');

  return {
    id,
    title: $('h2.title').text(),
    rating: $(
      '#main > div.work > div.wrapper > dl > dd.rating.tags > ul > li > a'
    ).text(),
    warnings: $('#main > div.work > div.wrapper > dl > dd.warning.tags a')
      .map((_, el) => $(el).text())
      .get(),
    categories: $(
      '#main > div.work > div.wrapper > dl > dd.category.tags > ul a'
    )
      .map((_, el) => $(el).text())
      .get(),
    relationships: $(
      '#main > div.work > div.wrapper > dl > dd.relationship.tags > ul a'
    )
      .map((_, el) => $(el).text())
      .get(),
    characters: $(
      '#main > div.work > div.wrapper > dl > dd.character.tags > ul a'
    )
      .map((_, el) => $(el).text())
      .get(),
    tags: $('#main > div.work > div.wrapper > dl > dd.freeform.tags > ul a')
      .map((_, el) => $(el).text())
      .get(),
    language: $('#main > div.work > div.wrapper > dl > dd.language')
      .text()
      .trim(),
    series: series.length
      ? {
          id: series.attr('href')?.replace('/series/', '') || '',
          title: series.text()
        }
      : undefined,
    stats: {
      published: new Date(`${stats.find('.published').text()} `),
      updated: new Date(`${stats.find('.status').text()} `),
      words: parseInt(stats.find('.words').text()),
      chapters: stats
        .find('.chapters')
        .text()
        .split('/')
        .map(x => parseInt(x)) as [number, number],
      kudos: parseInt(stats.find('.kudos').text()),
      bookmarks: parseInt(stats.find('.bookmarks a').text()),
      hits: parseInt(stats.find('.hits').text())
    }
  };
}
export async function getWorks(ids: string[]): Promise<Work[]> {
  const works: Work[] = [];
  for (const id of ids) {
    works.push(await getWork(id));
  }
  return works;
}
