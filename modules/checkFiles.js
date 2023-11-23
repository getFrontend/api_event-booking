import fs from "node:fs/promises";

const COMEDIANS = 'data/comedians.json';
const CLIENTS = 'data/clients.json';

export const checkFiles = async () => {
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