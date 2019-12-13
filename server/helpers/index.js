import request from "request";

import { network, marketChartEndpoint } from '../../config'

export const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
};

const asyncRequest = (options) => {
  return new Promise(function(resolve, reject) {
    try {
      request(options, function (error, response, body) {
        if (error) {
          reject(error);
        }
        try {
          resolve(JSON.parse(body));
        } catch (e) {
          reject(error);
        }
      });
    } catch (e) {
      reject(e.message);
    }
  });
}

export const api = async (method, type, action, body, version = 'v1') => {
  var options = {
    method: method,
    url: `${network.protocol}://${network.host}:${network.port}` + '/' + version + '/'+ type +'/' + action,
    headers: {accept: 'application/json', 'content-type': 'application/json'},
    body: body,
    timeout: 3000
  };
  return await asyncRequest(options);

};

export const coinmarketcap = async () => {
  var options = {
    method: 'GET',
    url: marketChartEndpoint,
    timeout: 3000
  };
  return await asyncRequest(options);
};

export const producerInfo = async (url) => {
  var options = {
    method: 'GET',
    url: url,
    timeout: 3000
  };
  return await asyncRequest(options);
};

export const DifferenceInDays = (d1, d2) => {
  const data2 = new Date(d2 + 'Z')
  const DifferenceInTime = d1.getTime() - data2.getTime();
  const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
  return DifferenceInDays
}
