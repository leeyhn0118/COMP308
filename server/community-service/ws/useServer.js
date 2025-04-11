import {
  C as CloseCode,
  l as limitCloseReason,
  D as DEPRECATED_GRAPHQL_WS_PROTOCOL,
} from "../node_modules/graphql-ws/dist/common-CGW11Fyb.js";
import {
  h as handleProtocols,
  m as makeServer,
} from "../node_modules/graphql-ws/dist/server-BN3ZJY-a.js";

function useServer(options, ws, keepAlive = 12e3) {
  const isProd = process.env.NODE_ENV === "production";
  const server = makeServer(options);
  ws.options.handleProtocols = handleProtocols;

  ws.once("error", (err) => {
    console.error("WebSocket server error:", err);
    for (const client of ws.clients) {
      try {
        client.close(
          CloseCode.InternalServerError,
          limitCloseReason(err.message, "Internal server error"),
        );
      } catch {}
    }
  });

  ws.on("connection", (socket, request) => {
    socket.once("error", (err) => {
      console.error("Socket error:", err);
      socket.close(
        CloseCode.InternalServerError,
        limitCloseReason(err.message, "Internal server error"),
      );
    });

    let pongWait = null;
    const pingInterval =
      keepAlive > 0 && isFinite(keepAlive)
        ? setInterval(() => {
            if (socket.readyState === socket.OPEN) {
              pongWait = setTimeout(() => {
                socket.terminate();
              }, keepAlive);
              socket.once("pong", () => {
                clearTimeout(pongWait);
                pongWait = null;
              });
              socket.ping();
            }
          }, keepAlive)
        : null;

    const closed = server.opened(
      {
        protocol: socket.protocol,
        send: (data) =>
          new Promise((resolve, reject) => {
            if (socket.readyState !== socket.OPEN) return resolve();
            socket.send(data, (err) => (err ? reject(err) : resolve()));
          }),
        close: (code, reason) => socket.close(code, reason),
        onMessage: (cb) =>
          socket.on("message", async (event) => {
            try {
              await cb(String(event));
            } catch (err) {
              console.error("Message handling error:", err);
              socket.close(
                CloseCode.InternalServerError,
                limitCloseReason(err.message, "Internal server error"),
              );
            }
          }),
      },
      { socket, request },
    );

    socket.once("close", (code, reason) => {
      if (pongWait) clearTimeout(pongWait);
      if (pingInterval) clearInterval(pingInterval);
      if (
        !isProd &&
        code === CloseCode.SubprotocolNotAcceptable &&
        socket.protocol === DEPRECATED_GRAPHQL_WS_PROTOCOL
      ) {
        console.warn(`Deprecated subprotocol used: ${socket.protocol}`);
      }
      closed(code, String(reason));
    });
  });

  return {
    dispose: async () => {
      for (const client of ws.clients) {
        client.close(1001, "Going away");
      }
      ws.removeAllListeners();
      await new Promise((resolve, reject) => {
        ws.close((err) => (err ? reject(err) : resolve()));
      });
    },
  };
}

export { useServer };
