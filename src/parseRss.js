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
    const itemsNode = dom.querySelectorAll('item');
    const posts = Array.prototype.map.call(itemsNode, (item) => {
      const postTitle = item.querySelector('title').textContent;
      const postDescription = item.querySelector('description').textContent;
      const url = item.querySelector('link').textContent;
      return [url, postTitle, postDescription];
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
