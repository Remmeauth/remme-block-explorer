import request from "request";

export const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
};

export const api = (type, action, body) => {
    return new Promise(function(resolve, reject) {
      try {
        var options = {
          method: 'POST',
          url: 'https://eos.greymass.com/v1/'+ type +'/' + action,
          headers: {accept: 'application/json', 'content-type': 'application/json'},
          body: body
        };

        request(options, function (error, response, body) {
          if (error) reject(error);
          resolve(body);
        });
      } catch (e) {
        reject(e.message);
      }
    });
};
