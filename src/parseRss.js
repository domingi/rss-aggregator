export default (data) => {
  try {
    const parser = new DOMParser();
    const dom = parser.parseFromString(data.data.contents, 'text/xml');
    const errorNode = dom.querySelector('parsererror');
    if (errorNode) {
      throw new Error(errorNode);
    }
    const title = dom.querySelector('title').textContent;
    const description = dom.querySelector('description').textContent;
    const articles = dom.querySelectorAll('item');
    const posts = [];
    articles.forEach((article) => {
      const id = Math.random();
      const postTitle = article.querySelector('title').textContent;
      const postDescription = article.querySelector('description').textContent;
      const url = article.querySelector('link').textContent;
      posts.push([id, url, postTitle, postDescription]);
    });
    return {
      title, description, posts,
    };
  } catch (error) {
    const parseError = new Error(`parser error: ${error}`);
    parseError.code = 'parseError';
    throw parseError;
  }
};
