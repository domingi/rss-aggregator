export default (data, url) => {
  try {
    const parser = new DOMParser();
    const dom = parser.parseFromString(data.data.contents, 'text/xml');
    const title = dom.querySelector('title').textContent;
    const description = dom.querySelector('description').textContent;

    const articles = dom.querySelectorAll('item');
    const posts = [];
    articles.forEach((article) => {
      const id = Math.random();
      const postTitle = article.querySelector('title').textContent;
      const postDescription = article.querySelector('description').textContent;
      const link = article.querySelector('link').textContent;
      posts.push([id, link, postTitle, postDescription]);
    });
    return {
      title, description, url, posts,
    };
  } catch (error) {
    const parseError = new Error('data parsing error');
    parseError.code = 'parseError';
    throw parseError;
  }
};
