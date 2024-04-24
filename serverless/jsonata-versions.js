async function main(params) {
  const url = 'https://registry.npmjs.org/jsonata';
  let result = await fetch(url);
  result = await result.json();
  let tags = Object.keys(result.versions);
  const versions = {};
  tags.forEach(tag => {
      const minor = tag.substr(0, tag.lastIndexOf('.'));
      versions[minor] = tag;
  })
  result = Object.values(versions).reverse()
  return {
  statusCode: 200,
  headers: { 
    'Content-Type': 'application/json', 
  },
  body: { versions: result }
};
}

module.exports.main = main;