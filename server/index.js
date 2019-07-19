import "babel-polyfill";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

import { getBlock } from './actions'
import { getInfo, startDaemons } from './daemons'

const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200
};

const app = express();
const port = process.env.PORT || 3003;
app.use(cors(corsOptions));
app.use(bodyParser.json());

app.get('/api/getInfo', async (req, res) => {
  res.json(getInfo());
});

app.get('/api/getBlock/:id', async (req, res) => {
  const responce = await getBlock(req.params.id);
  console.log(responce);
  res.json(responce);
});

app.listen(port, () => console.log('\x1b[34m%s\x1b[0m',`Blockexplorer backend is running on localhost:${port}`));

const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
};

startDaemons();

// var request = require("request");
//
// var options = {
//   method: 'POST',
//   url: 'https://eos.greymass.com/v1/chain/get_info',
//   headers: {accept: 'application/json', 'content-type': 'application/json'},
// };
//
// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//
//   console.log(body);
// });

// var request = require("request");
//
// var options = {
//   method: 'POST',
//   url: 'https://eos.greymass.com/v1/history/get_actions',
//   headers: {'content-type': 'application/json'},
//   body: '{"pos":"-1", "offset":"-20"}'
// };
//
// request(options, function (error, response, body) {
//   if (error) throw new Error(error);
//
//   console.log(body);
// });
