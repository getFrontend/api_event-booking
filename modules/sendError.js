export const sendError = (res, statusCode, errMessage) => {
  res.writeHead(statusCode, {
    "Content-Type": "text/plain; charset=utf-8"
  })
  res.end(errMessage);
}