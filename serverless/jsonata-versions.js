const fetch = require("node-fetch");

/**
  *
  * main() will be run when you invoke this action
  *
  * @param Cloud Functions actions accept a single parameter, which must be a JSON object.
  *
  * @return The output of this action, which must be a JSON object.
  *
  */
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
    return { versions: result };
}
