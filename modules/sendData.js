export const sendData = (res, data) => {
  res.writeHead(200, {
    "Content-Type": "text/json; charset=utf-8",
  });
  res.end(data);
}