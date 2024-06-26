// remix server
import { createRequestHandler } from "@remix-run/express";
import jwt from "jsonwebtoken";

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
    const token = socket.handshake?.auth?.token;
    if (!token) {
        return socket.disconnect(true);
    }

    // verify the token
    try {
        jwt.verify(token, process.env.SOCKET_AUTH_SECRET as string);
        console.log("Token verified");
    } catch (e) {
        return socket.disconnect(true);
    }

    // inside WS connection per client
    console.log(socket.id, "connected");
    socket.emit("confirmation", "connected!");

    // when we get a message, relay to other clients
    socket.on("message", (data) => {
        console.log("Received message: ", data.content);
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

// @ts-expect-error See https://github.com/remix-run/remix/issues/8343
app.all("*", createRequestHandler({ build }));

const PORT = process.env.PORT || 3000;

// instead of running listen on the Express app, do it on the HTTP server
httpServer.listen(PORT, () => {
    console.log(`Express server listening on port ${PORT}`);
});
