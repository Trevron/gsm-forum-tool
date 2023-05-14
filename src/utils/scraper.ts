import axios from 'axios';
import cheerio, { Cheerio } from 'cheerio';
import { isValidDate, parseDate } from './date';

export async function fetchHTML(url: string): Promise<string | undefined> {
  const proxyUrl = process.env.NODE_ENV === 'production' ? 'https://cors-anywhere-clone.herokuapp.com/' : 'http://localhost:8080/';

  try {
    const { data } = await axios.get(proxyUrl + url, {
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    return data;
  } catch (error) {
    console.error(`Error fetching URL: ${url}`);
    console.error(error);
  }
}


export async function scrapeUsernames(id: string, pageCount: number): Promise<string[]> {
  let usernames: string[] = [];
  let postDate: Date | null = null;
  
  for (let page = 1; page <= pageCount; page++) {
    const offset = (page - 1) * 20;
    const ajaxUrl = `https://gosupermodel.com/widgetcontent?widget=17&id=${id}&offset=${offset}&contentID=target&rnd=${Date.now()}`;
    const html = await fetchHTML(ajaxUrl);
    
    if (!html) {
      continue;
    }

    const $ = cheerio.load(html);
    const usernameSelector = 'a[modelname]'; 
    
    $(usernameSelector).each((_index, element) => {
      const username = $(element).attr('modelname'); 
      if (username) {
        // Get post dates and only accept usernames up until 5am
        const previousTR = $(element).closest('tr').prevAll('tr').first();
        const date =  previousTR.find('.post_date');
        const parsedDate = parseDate(date.text());
        if (!postDate) {
          postDate = parsedDate;
        }
        if (postDate && isValidDate({parsedDate, postDate})) {
          usernames.push(username.trim());
        }
      }
    });

  }

  const onlyUnique = (value: string, index: number, array: string[]) => {
    return array.indexOf(value) === index;
  }

  const caseInsensitiveCompare = (a: string, b: string): number => {
    const lowerA = a.toLowerCase();
    const lowerB = b.toLowerCase();
  
    if (lowerA < lowerB) {
      return -1;
    }
    if (lowerA > lowerB) {
      return 1;
    }
    return 0;
  };

  return usernames.filter(onlyUnique).sort(caseInsensitiveCompare);
}

export async function getPost(id: string): Promise<string> {
    const pageUrl = `https://gosupermodel.com/community/forum_thread.jsp?id=${id}`;
    const html = await fetchHTML(pageUrl);
    
    if (!html) {
      return '';
    }

    const $ = cheerio.load(html);
  
    const postSelector = '#post_link_tracking_0';  
    

    const post = $(postSelector).html();
    if (!post) {
      return '';
    }

  return post;
}