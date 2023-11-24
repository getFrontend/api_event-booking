import { CLIENTS } from "./checkFile.js";
import { sendData } from "./sendData.js";
import { sendError } from "./sendError.js";
import fs from 'node:fs/promises';

export const handleClientsRequests = async (req, res, ticketNumber) => {
  try {
    const clientData = await fs.readFile(CLIENTS, 'utf8');
    const clients = JSON.parse(clientData);
    const client = clients.find((c) => c.ticketNumber === ticketNumber);

    if (!client) {
      sendError(res, 404, 'Вибачте, але такого номера білета немає');
      return;
    }

    sendData(res, client);
  } catch (error) {
    sendError(res, 500, 'Під час обробки запиту виникла помилка');
  }
}