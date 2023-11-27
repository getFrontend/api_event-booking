import fs from "node:fs/promises";

export const COMEDIANS = 'data/comedians.json';
export const CLIENTS = 'data/clients.json';

export const checkFileExist = async (path) => {
  try {
    await fs.access(path);
  } catch (error) {
    console.error(`File ${path} is not found`)
    return false;
  }

  return true;
}

export const createFileIfNotExist = async (path) => {
  try {
    await fs.access(path);
  } catch (error) {
    console.error(error);
    await fdatasync.writeFile(path, JSON.stringify([]));
    console.log(`File ${path} was successfully created!`);
    return true;
  }
}