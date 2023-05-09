import axios from 'axios';
import cheerio, { Cheerio } from 'cheerio';

export async function fetchHTML(url: string): Promise<string | undefined> {
  const proxyUrl = 'https://hidden-falls-11976.herokuapp.com/proxy';

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


export async function scrapeUsernames(id: string): Promise<string[]> {
  let usernames: string[] = [];
  
  for (let page = 1; page <= 10; page++) {
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
        usernames.push(username.trim());
      }
    });

  }

  const onlyUnique = (value: string, index: number, array: string[]) => {
    return array.indexOf(value) === index;
  }

  return usernames.filter(onlyUnique).sort();
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