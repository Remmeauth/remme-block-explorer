import "babel-polyfill";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

import { getBlock, getTransaction, getAccount, getBalance, getProducer, getActions, getSwapInfo } from './actions'
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
  res.json(responce);
});

app.get('/api/getTransaction/:id', async (req, res) => {
  const responce = await getTransaction(req.params.id);
  res.json(responce);
});

app.get('/api/getAccount/:id', async (req, res) => {
  const responce = await getAccount(req.params.id);
  res.json(responce);
});

app.get('/api/getActions/:id', async (req, res) => {
  const responce = await getActions(req.params.id);
  res.json(responce);
});

app.get('/api/getSwapInfo/:id', async (req, res) => {
  const responce = await getSwapInfo(req.params.id);
  res.json(responce);
});

app.listen(port, () => console.log('\x1b[34m%s\x1b[0m',`Blockexplorer backend is running on localhost:${port}`));

const sleep = (ms) => {
  return new Promise(resolve=>{
    setTimeout(resolve,ms)
  })
};

startDaemons();
