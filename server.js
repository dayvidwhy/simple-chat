// remix server
import { createRequestHandler } from "@remix-run/express";

// server libs
import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";

const viteDevServer =
  process.env.NODE_ENV === "production"
      ? null
      : await import("vite").then((vite) =>
          vite.createServer({
              server: { middlewareMode: true },
          })
      );

const app = express();
app.use(
    viteDevServer
        ? viteDevServer.middlewares
        : express.static("build/client")
);

// create http server from express
const httpServer = createServer(app);

// attach socket.io server to http server
const io = new Server(httpServer);

// listen for the client connecting to the WS server
io.on("connection", (socket) => {
    // inside WS connection per client
    console.log(socket.id, "connected");
    socket.emit("confirmation", "connected!");

    // when we get a message, relay to other clients
    socket.on("message", (data) => {
        console.log("Received message: ", data.message);
        console.log("Broadcasting to chatId: ", data.chatId);
        socket.broadcast.emit(`message-${data.chatId}`, data);
    });
});

const build = viteDevServer
    ? () =>
        viteDevServer.ssrLoadModule(
            "virtual:remix/server-build"
        )
    : await import("./build/server/index.js");

app.all("*", createRequestHandler({ build }));

const PORT = process.env.PORT || 3000;

// instead of running listen on the Express app, do it on the HTTP server
httpServer.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});
  
