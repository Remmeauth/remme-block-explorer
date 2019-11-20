import request from "request";

import { network, marketChartEndpoint } from '../../config'

export const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
};

export const api = (method, type, action, body, version = 'v1') => {
    return new Promise(function(resolve, reject) {
      // if (method == 'GET') {
      //   console.log(`${network.protocol}://${network.host}:${network.port}` + '/' + version + '/'+ type +'/' + action);
      // };
      try {
        var options = {
          method: method,
          url: `${network.protocol}://${network.host}:${network.port}` + '/' + version + '/'+ type +'/' + action,
          headers: {accept: 'application/json', 'content-type': 'application/json'},
          body: body
        };

        request(options, function (error, response, body) {
          if (error) {
            reject(error);
          }
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
          timeout: 3000
        };
        request(options, function (error, response) {
          if (error) reject(error);
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

export const DifferenceInDays = (d1, d2) => {
  const data2 = new Date(d2 + 'Z')
  const DifferenceInTime = d1.getTime() - data2.getTime();
  const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
  return DifferenceInDays
}
