import { sendError } from "./sendError.js";
import { sendData } from "./sendData.js";

export const handleComediansRequest = async (req, res, comedians, id) => {
  if (id) {
    const comedian = comedians.find((c) => c.id === id);

    if (!comedian) {
      sendError(res, 404, 'Sorry, but this comedian is not found!')
      return;
    }

    sendData(res, comedian);
    return;
  }
  sendData(res, comedians);
}

