async function main(params) {
    const url = `https://${process.env.CLOUDANTNOSQLDB_HOST}/exerciser/${params.id}`;
    const auth = Buffer.from(process.env.CLOUDANTNOSQLDB_USERNAME + ':' + process.env.CLOUDANTNOSQLDB_PASSWORD, "binary").toString("base64");
    var headers = {
      'Authorization': `Basic ${auth}`
    };
  
    let result;
    try {
      result = await fetch(url, {headers: headers});
      result = await result.json();
      return {
        statusCode: 200,
        headers: { 
          'Content-Type': 'application/json', 
        },
        body: {
          json: result.input,
          jsonata: result.jsonata,
          bindings: result.bindings,
          externalLibs: result.externalLibs
        }
      };
    } catch (error) {
      return {
        statusCode: 500,
        headers: { 
          'Content-Type': 'application/json', 
        },
        body: {'error': error.message }
      };
    }
  }
  
  module.exports.main = main;
  