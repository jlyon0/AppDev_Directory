const { createServer } = require("https");
const { parse } = require("url");
const next = require("next");
const fs = require("fs");
// const hostname = 'docker-dev.butler.edu'
const hostname = 'localhost'
const port = 3000;
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, hostname, port })
const handle = app.getRequestHandler();

const httpsOptions = {
    key: fs.readFileSync("./ssl/docker-dev.butler.edu.key"),
    cert: fs.readFileSync("./ssl/docker-dev.butler.edu.crt"),
    ca: [fs.readFileSync("./ssl/letsencrypt.crt")]
};

app.prepare().then(() => {
    createServer(httpsOptions, (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err)
        res.statusCode = 500
        res.end('internal server error')
      }
    }).listen(port, (err) => {
        if (err) throw err;
        console.log(`ready - started server on url: https://${hostname}:${port}`);
    });
});