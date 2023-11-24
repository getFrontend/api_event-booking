import { sendError } from "./sendError.js";
import fs from 'node:fs/promises';

export const handleAddClient = (req, res) => {
  let body = '';

  try {
    req.on('data', chunk => {
      body += chunk;
    });
  } catch (error) {
    console.log(`Помилка під час читання запиту`);
    sendError(res, 500, 'Помилка серверу під час читання запиту');
  }

  req.on('end', async () => {
    try {
      const newClient = JSON.parse(body);

    } catch (error) {

    }
  })
}