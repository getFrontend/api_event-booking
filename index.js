import http from 'node:http';
import fs from "node:fs/promises";

const PORT = 8080;
const COMEDIANS = 'data/comedians.json';
const CLIENTS = 'data/clients.json';

const checkFiles = async () => {
  try {
    await fs.access(COMEDIANS);
  } catch (error) {
    console.error(`File ${COMEDIANS} is not found`)
    return false;
  }

  try {
    await fs.access(CLIENTS);
    return true;
  } catch (error) {
    await fs.writeFile(CLIENTS, JSON.stringify([]));
    console.log(`File ${CLIENTS} was sucssessfully created`)
    return false;
  }
}

const startServer = async (req, res) => {
  if (!(await checkFiles())) {
    return;
  }

  http
    .createServer(async (req, res) => {
      const reqURL = new URL(req.url, `http://${req.headers.host}`);
      const pathName = req.utl.pathName;
      const segments = req.utl.split('/');

      if (req.method === 'GET' && req.url === '/artists') {
        try {
          const data = await fs.readFile(COMEDIANS, 'utf-8');
          res.writeHead(200, {
            "Content-Type": "text/json; charset=utf-8",
            "Access-Control-Allow-Origin": "*",
          });
          res.end(data);
        } catch (error) {
          res.writeHead(500, {
            "Content-Type": "text/plain; charset=utf-8",
          });
          res.end(`Server Error: ${error}`);
        }
      } else {
        res.writeHead(404, {
          "Content-Type": "text/json; charset=utf-8",
        });
        res.end('404: page is not found')
      }
    })
    .listen(PORT);

  console.log(`Server is running on http://localhost:${PORT}`);
}

startServer();