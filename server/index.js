import "babel-polyfill";
import express from "express";
import path from "path";
import bodyParser from "body-parser";
import cors from "cors";

import { getBlock, getTransaction, getAccount, getBalance, getProducer, getActions, getSwapInfo, getVoters, getSwapFee } from './actions'
import { getGuardians } from './daemons/guardians.daemon.js'
import { getInfo, startDaemons, startSlowDaemons } from './daemons'

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

app.get('/api/getSwapFee', async (req, res) => {
  res.json(await getSwapFee());
});

app.get('/api/getBlock/:id', async (req, res) => {
  res.json(await getBlock(req.params.id));
});

app.get('/api/getTransaction/:id', async (req, res) => {
  res.json(await getTransaction(req.params.id));
});

app.get('/api/getAccount/:id', async (req, res) => {
  res.json(await getAccount(req.params.id));
});

app.get('/api/getActions/:id', async (req, res) => {
  res.json(await getActions(req.params.id));
});

app.get('/api/getActions/:id/:position', async (req, res) => {
  res.json(await getActions(req.params.id, req.params.position));
});

app.get('/api/getSwapInfo/:id', async (req, res) => {
  res.json(await getSwapInfo(req.params.id));
});

app.get('/api/getVotersInfo', async (req, res) => {
  res.json(await getVoters());
});

app.get('/api/getGuardians', async (req, res) => {
  const responce = await getGuardians();
  res.json(responce);
});

app.listen(port, () => console.log('\x1b[34m%s\x1b[0m',`Blockexplorer backend is running on localhost:${port}`));

startDaemons();
startSlowDaemons();
