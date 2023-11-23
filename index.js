import http from 'node:http';
import fs from "node:fs/promises";

const PORT = 8080;
const COMEDIANS = 'data/comedians.json';
const CLIENTS = 'data/clients.json';
// const PROTOCOL = 'http://'

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

const sendData = (res, data) => {
  res.writeHead(200, {
    "Content-Type": "text/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*"
  });
  res.end(data);
}

const sendError = (res, statusCode, errMessage) => {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8"
  })
  res.end(errMessage);
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
          const data = await fs.readFile(COMEDIANS, 'utf-8');

          if (segments.length === 2) {
            const comedian = JSON.parse(data)
              .find((c) => c.id === segments[1]);

            if (!comedian) {
              sendError(res, 404, 'Sorry, but this comedian is not found!')
              return;
            }

            sendData(res, JSON.stringify(comedian));
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