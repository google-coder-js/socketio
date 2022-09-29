require("dotenv").config({ path: `.env.${process.env.NODE_ENV}` });
const express = require("express");
const http = require("http");
const { createServer } = require("https");
const socketio = require("socket.io");
const app = express();
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const PORT = process.env.PORT || 5005;
const httpProxy = require("http-proxy");
console.log("ENVIRONMENT: ", process.env.NODE_ENV, process.env.PORT);
// app.use(
//   cors({
//     origin: "https://localhost:5050",
//     methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//     credentials: true,
//   })
// );

app.use(express.static(path.join(__dirname, "build")));

const httpServer = http.createServer(app);
// const httpsServer = createServer(
//   {
//     key: fs.readFileSync(path.join(__dirname, "cert", "key.pem")),
//     cert: fs.readFileSync(path.join(__dirname, "cert", "cert.pem")),
//     requestCert: false,
//     rejectUnauthorized: false,
//   },
//   app
// );

const io = socketio(httpServer, {
  // serveClient: false,
  // path: "/socket.io",
  /*  cors: {
    origin: "https://localhost:3000",
    credentials: true,
  }, */
});

io.on("connection", (socket) => {
  console.log("connected", socket);
  socket.on("start", (data) => {
    io.emit("message", "Welcome to the chat socket 1 ");
    console.log("data received", data);
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});

const io2 = socketio(7010, {
  cors: {
    origin: `http://localhost:${PORT}`,
    credentials: true,
  },
});
// httpProxy
//   .createServer({
//     target: "http://localhost:7010",
//     ws: true,
//     secure: false,
//     // changeOrigin: true,
//   })
//   .listen(7012);
// httpProxy
//   .createServer({
//     target: "https://localhost:5005",
//     ws: true,
//     secure: false,
//     // changeOrigin: true,
//   })
//   .listen(7012);

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/build/index.html");
});

app.get("/hello", (req, res) => {
  res.cookie("test", "test");
  res.send("Hello World! 🌏");
});
app.get("/world", (req, res) => {
  res.send("Hello World!! 🌏");
});

io2.on("connection", (socket) => {
  // console.log("connected", socket);
  socket.on("start", (data) => {
    io.emit("message", "Socket 2");
    console.log("data received", data);
  });
  socket.on("disconnect", () => {
    console.log("socket disconnected");
  });
});
httpServer.listen(PORT, () => {
  console.log("http server running 🚀 at ", PORT);
});
