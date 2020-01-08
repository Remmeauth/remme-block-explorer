import request from "request";
import colors from "colors";

export const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
};

const asyncRequest = (options) => {
  return new Promise(function(resolve, reject) {
    try {
      console.log(new Date().toLocaleString().cyan, '[ REQUEST ]', `${options.url}`.grey);
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
    url: `${process.env.REACT_APP_NODE_API_URI}/${version}/${type}/${action}`,
    headers: {accept: 'application/json', 'content-type': 'application/json'},
    body: body,
    timeout: 3000
  };
  const resp = await asyncRequest(options);
  console.log(new Date().toLocaleString().cyan, '[ REQUEST ]', `DONE`.grey);
  return resp
};

export const coinmarketcap = async () => {
  var options = {
    method: 'GET',
    url: process.env.REACT_APP_MARKET_CHART,
    timeout: 3000
  };
  const resp = await asyncRequest(options);
  console.log(new Date().toLocaleString().cyan, '[ REQUEST ]', `DONE`.grey);
  return resp
};

export const producerInfo = async (url) => {
  var options = {
    method: 'GET',
    url: url,
    timeout: 3000
  };
  const resp = await asyncRequest(options);
  console.log(new Date().toLocaleString().cyan, '[ REQUEST ]', `DONE`.grey);
  return resp
};

export const DifferenceInDays = (d1, d2) => {
  const data2 = new Date(d2 + 'Z')
  const DifferenceInTime = d1.getTime() - data2.getTime();
  const DifferenceInDays = DifferenceInTime / (1000 * 3600 * 24);
  return DifferenceInDays
}
