import { CLIENTS } from "./checkFile.js";
import { sendData } from "./sendData.js";
import { sendError } from "./sendError.js";
import fs from 'node:fs/promises';

export const handleUpdateClient = (req, res, segments) => {
  let body = '';
  const ticketNumber = segments[1];

  try {
    req.on('data', (chunk) => {
      body += chunk;
    });
  } catch (error) {
    console.log(`Помилка під час читання запиту`);
    sendError(res, 500, 'Помилка серверу під час читання запиту');
  }

  req.on('end', async () => {
    try {
      console.log(body);
      const updateClientData = JSON.parse(body);

      if (
        !updateClientData.fullName ||
        !updateClientData.phone ||
        !updateClientData.ticketNumber ||
        !updateClientData.booking
      ) {
        sendError(res, 400, `Вибачте, але ваші дані невірні!`);
        return;
      }

      if (
        updateClientData.booking &&
        (!updateClientData.booking.length ||
          !Array.isArray(updateClientData.booking) &&
          !updateClientData.booking.every((item) => item.comedian && item.time))
      ) {
        sendError(res, 400, `Вибачте, але дані бронювання не вірні`);
        return;
      }

      const cliendData = await fs.readFile(CLIENTS, 'utf8');
      const clients = JSON.parse(cliendData);

      const clientIndex = clients.findIndex((c) => c.ticketNumber === ticketNumber);

      if (clientIndex === -1) {
        sendError(res, 404, 'Вибачте, але клієнта з таким номером не знайдено');
        return;
      }

      clients[clientIndex] = {
        ...clients[clientIndex],
        ...updateClientData
      }

      await fs.writeFile(CLIENTS, JSON.stringify(clients));
      sendData(res, clients[clientIndex]);
    } catch (error) {
      console.error(`error: ${error}`);
      sendError(res, 500, 'Помилка серверу при оновленні даних');
    }
  })
}