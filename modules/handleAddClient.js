import { CLIENTS } from "./checkFile.js";
import { sendData } from "./sendData.js";
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
      console.log(body);
      const newClient = JSON.parse(body);

      if (
        !newClient.fullName ||
        !newClient.phone ||
        !newClient.ticketNumber ||
        !newClient.booking
      ) {
        sendError(res, 400, `Вибачте, але ваші дані невірні!`);
        return;
      }

      if (
        newClient.booking &&
        (!newClient.booking.length ||
          !Array.isArray(newClient.booking) &&
          !newClient.booking.every((item) => item.comedian && item.time))
      ) {
        sendError(res, 400, `Вибачте, але дані бронювання не вірні`);
        return;
      }

      const cliendData = await fs.readFile(CLIENTS, 'utf8');
      const clients = JSON.parse(cliendData);

      clients.push(newClient);

      await fs.writeFile(CLIENTS, JSON.stringify(clients));
      sendData(res, newClient);
    } catch (error) {
      console.log('error', error);
      sendError(res, 400, 'Під час читання запиту на сервері сталася помилка')
    }
  })
}