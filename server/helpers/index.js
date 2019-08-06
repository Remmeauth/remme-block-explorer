import request from "request";

import { network, marketChartEndpoint } from '../../config'

export const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
};

export const api = (method, type, action, body) => {
    return new Promise(function(resolve, reject) {

      if (method == 'GET') {
        console.log(network.host + '/v1/'+ type +'/' + action);
      };
      try {
        var options = {
          method: method,
          url: network.host + '/v1/'+ type +'/' + action,
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

export const coinmarketcap = () => {
    return new Promise(function(resolve, reject) {
      try {
        var options = {
          method: 'GET',
          url: marketChartEndpoint,
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

export const producerInfo = (url) => {
    return new Promise(function(resolve, reject) {
      try {
        var options = {
          method: 'GET',
          url: url,
        };
        request(options, function (error, response) {
          if (error) reject(error);
          console.log(response);
          if (response !== undefined) {
            resolve(response.body);
          } else {
            resolve({});
          }
        });
      } catch (e) {
        reject(e.message);
      }
    });
};
