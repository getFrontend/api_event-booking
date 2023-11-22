import http from 'node:http';
import fs from "node:fs/promises";

const PORT = 8080;

const startServer = async () => {
  http
    .createServer(async (req, res) => {
      if (req.method === 'GET' && req.url === '/artists') {
        try {
          const data = await fs.readFile('data/comedians.json', 'utf-8', (err, data) => {
          });
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