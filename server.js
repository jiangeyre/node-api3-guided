const express = require('express'); // importing a CommonJS module

const hubsRouter = require('./hubs/hubs-router.js');

const server = express();

// global middleware (cares about all requests)
server.use(express.json());

// write a middleware called uppercaser, that takes the name from the body and makes it uppercase before it makes it to the resquest handler/router. Only apply that middleware to routes that begin with /api/hubs

function logger(req, res, next) {
  const { method, originalUrl } = req;
  console.log(`${method} to ${originalUrl}`);

  next();
};

server.use(logger);

// build the echo mw, that will simply retrun whatever is sent in the body
function echo(req, res, next) {
  console.log(req.body);

  next();
};

server.use(echo);

// write a gatekeeper mw that reads a pw from the headers, if the pw is "mellon", let the request continue
// if the pw is wrong, then return status code 401 and an object like this: { you: "cannot pass!" }
function gatekeeper(req, res, next) {
  if(req.headers.password === 'mellon') {
    next();
  } else {
    res.status(401).json({ message: "YOU SHALL NOT PASS."});
  }
};

server.use(gatekeeper);

// cares only about requests beginning with /api/hubs
server.use('/api/hubs', hubsRouter);

server.get('/', (req, res) => {
  const nameInsert = (req.name) ? ` ${req.name}` : '';

  res.send(`
    <h2>Lambda Hubs API</h2>
    <p>Welcome${nameInsert} to the Lambda Hubs API</p>
    `);
});

server.use(greeter);
// three amigas
function greeter(req, res, next) {
  res.status(200).json({ hi: 'hecka there' });
};

module.exports = server;
