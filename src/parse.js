export default (data) => {
  const parse = new DOMParser();
  const doc = parse.parseFromString(data, 'application/xml');
  if (doc.querySelector('parsererror')) {
    throw new Error('invalidRSS');
  }
  const feed = {
    title: doc.querySelector('title').textContent,
    description: doc.querySelector('description').textContent,
  };

  const posts = Array.from(doc.querySelectorAll('item')).map((item) => {
    const post = {
      title: item.querySelector('title').textContent,
      description: item.querySelector('description').textContent,
      link: item.querySelector('link').textContent,
    };
    return post;
  });

  return { feed, posts };
};
