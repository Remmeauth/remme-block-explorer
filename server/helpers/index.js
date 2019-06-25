import request from "request";

import { nodeAddress } from '../../config'

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
          url: nodeAddress + '/v1/'+ type +'/' + action,
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
