import http from 'node:http';
import fs from "node:fs/promises";
import { CLIENTS, COMEDIANS, checkFile } from './checkFile.js';
import { sendError } from './sendError.js';
import { handleComediansRequest } from './handleComediansRequest.js';
import { handleAddClient } from './handleAddClient.js';

const PORT = 8080;

export const startServer = async () => {
  if (!(await checkFile(COMEDIANS))) {
    return;
  }

  await checkFile(CLIENTS, true);

  const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
  const comedians = JSON.parse(comediansData);

  http
    .createServer(async (req, res) => {
      try {
        res.setHeader("access-Control-Allow-Origin", "*");

        const segments = req.url.split('/').filter(Boolean);

        if (req.method === 'GET' && segments[0] === 'artists') {
          handleComediansRequest(req, res, comedians, segments);
          return;
        }

        if (req.method === 'POST' && segments[0] === 'clients') {

          handleAddClient(req, res);
          return;
        }

        if (
          req.method === 'GET' &&
          segments[0] === 'clients' &&
          segments.length === 2
        ) {
          console.log('Get: get client by ticket number')
        }

        if (
          req.method === 'PATCH' &&
          segments[0] === 'clients' &&
          segments.length === 2
        ) {
          console.log('Patch: update client by ticket number')
          handleUpdateClients(req, res, segments);
          return;
        }

        sendError(res, 404, '404: page is not found');
      } catch (error) {
        sendError(res, 500, `Server Error: ${error}`)
      }
    })
    .listen(PORT);

  console.log(`Server is running on http://localhost:${PORT}`);
}