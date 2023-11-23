import fs from "node:fs/promises";

export const COMEDIANS = 'data/comedians.json';
export const CLIENTS = 'data/clients.json';

export const checkFile = async (path, createIfMissing) => {
  if (createIfMissing) {
    try {
      await fs.access(path);
    } catch (error) {
      await fs.writeFile(path, JSON.stringify([]));
      console.log(`File ${path} was sucssessfully created`)
      return true;
    }
  }
  try {
    await fs.access(path);
  } catch (error) {
    console.error(`File ${path} is not found`)
    return false;
  }

  return true;
}