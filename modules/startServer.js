import http from 'node:http';
import fs from "node:fs/promises";
import { CLIENTS, COMEDIANS, checkFileExist, createFileIfNotExist } from './checkFile.js';
import { sendError } from './sendError.js';
import { handleComediansRequest } from './handleComediansRequest.js';
import { handleAddClient } from './handleAddClient.js';
import { handleClientsRequests } from './handleClientsRequests.js';
import { handleUpdateClient } from './handleUpdateClient.js';

export const PORT = 8080;

export const startServer = async (port) => {
  if (!(await checkFileExist(COMEDIANS))) {
    return;
  }

  await createFileIfNotExist(CLIENTS, true);

  const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
  const comedians = JSON.parse(comediansData);

  const server = http
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
          const ticket = segments[1];
          handleClientsRequests(req, res, ticket);
          return;
        }

        if (
          req.method === 'PUT' &&
          segments[0] === 'clients' &&
          segments.length === 2
        ) {
          console.log('Patch: update client by ticket number')
          handleUpdateClient(req, res, segments);
          return;
        }

        sendError(res, 404, '404: page is not found');
      } catch (error) {
        sendError(res, 500, `Server Error: ${error}`)
      }
    });

  server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });
};