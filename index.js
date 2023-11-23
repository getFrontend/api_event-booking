import http from 'node:http';
import fs from "node:fs/promises";
import { sendData, sendError } from './modules/send.js';

const COMEDIANS = 'data/comedians.json';
const CLIENTS = 'data/clients.json';
const PORT = 8080;

const checkFiles = async () => {
  try {
    await fs.access(COMEDIANS);
  } catch (error) {
    console.error(`File ${COMEDIANS} is not found`)
    return false;
  }

  try {
    await fs.access(CLIENTS);
  } catch (error) {
    await fs.writeFile(CLIENTS, JSON.stringify([]));
    console.log(`File ${CLIENTS} was sucssessfully created`)
    return false;
  }

  return true;
}

const startServer = async () => {
  if (!(await checkFiles())) {
    return;
  }

  http
    .createServer(async (req, res) => {
      try {
        const segments = req.url.split('/').filter(Boolean);

        if (req.method === 'GET' && segments[0] === 'artists') {
          const comediansData = await fs.readFile(COMEDIANS, 'utf-8');
          const comedians = JSON.parse(comediansData);

          if (segments.length === 2) {
            const comedian = comedians.find((c) => c.id === segments[1]);

            if (!comedian) {
              sendError(res, 404, 'Sorry, but this comedian is not found!')
              return;
            }

            sendData(res, comedians);
            return;
          }
          sendData(res, data);
          return;
        }

        if (req.method === 'POST' && segments[0] === 'clients') {
          console.log('Post: add client')
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
        }

        sendError(res, 404, '404: page is not found');
      } catch (error) {
        sendError(res, 500, `Server Error: ${error}`)
      }
    })
    .listen(PORT);

  console.log(`Server is running on http://localhost:${PORT}`);
}

startServer();