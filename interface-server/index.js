const express = require("express");
const expressApp = express();
const cors = require("cors");
const http = require("http");
const socketIO = require("socket.io");
const Suscription = require("./orionSuscriptor");
const { NODE_SERVER_PORT, DOCKER_HOST } = require("./constants");

/**
 * Manage Orion Broker Suscription
 */
Suscription.checkOrSetSuscription();

/**
 * Manage server to receive notifications
 * and broadcast them to front-end
 */
const httpServer = http.createServer(expressApp);
const sockets = [];
const io = socketIO(httpServer, {
//   path: "/socket",
  cors: {
    origin: "*",
    methods: ["GET"],
  },
});

expressApp.use(express.static("front"));
expressApp.use(cors());
expressApp.use(express.urlencoded({ extended: true }));
expressApp.use(express.json());
expressApp.post("/subscriptions", (req, res) => {
  console.log(req.body);
  // emit io
  io.sockets.emit("data", req.body);
  res.sendStatus(201);
});

httpServer.listen(NODE_SERVER_PORT, () => {
  console.log(`Listening to port ${NODE_SERVER_PORT}`);
});
