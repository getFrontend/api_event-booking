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

  http
    .createServer(async (req, res) => {
      try {
        res.setHeader("access-Control-Allow-Origin", "*");

        const segments = req.url.split('/').filter(Boolean);

        if (!segments.length) {
          sendError(res, 404, 'Не знайдено');
          return;
        }

        const [resource, id] = segments;

        if (req.method === 'GET' && resource === 'artists') {
          handleComediansRequest(req, res, comedians, id);
          return;
        }

        if (req.method === 'POST' && resource === 'clients') {

          handleAddClient(req, res);
          return;
        }

        if (
          req.method === 'GET' &&
          resource === 'clients' &&
          segments.length === 2
        ) {
          handleClientsRequests(req, res, id);
          return;
        }

        if (
          req.method === 'PUT' &&
          resource === 'clients' &&
          segments.length === 2
        ) {
          handleUpdateClient(req, res, id);
          return;
        }

        sendError(res, 404, '404: page is not found');
      } catch (error) {
        sendError(res, 500, `Server Error: ${error}`)
      }
    })
    .listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
};