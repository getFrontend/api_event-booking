export const readRequestBody = (req) => {
  new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      resolve(body);
    });

    req.on('error', (err) => {
      reject(err);
    })

    console.log(`Помилка під час читання запиту`);
    sendError(res, 500, 'Помилка серверу під час читання запиту');

  });
}