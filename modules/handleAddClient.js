import { sendData } from "./sendData.js";
import { sendError } from "./sendError.js";
import fs from 'node:fs/promises';

export const handleAddClient = (req, res) => {
  let body = `""`;

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
        !newClient.ticketNumber
      ) {
        sendError(res, 400, `Вибачте, але ваші дані невірні!`);
        return;
      }

      if (
        newClient.booking &&
        (!Array.isArray(newClient.booking) ||
          !newClient.booking.every(item => item.comedian && item.time))
      ) {
        sendError(res, 400, `Вибачте, але дані були заповнені не до кінця`);
      }

      sendData(res, newClient);
    } catch (error) {
      console.log('error', error);
    }
  })
}