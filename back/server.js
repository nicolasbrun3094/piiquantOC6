// ---- Import du package HTTP de Node.JS ---- //
const http = require("http");

// ---- Import de l'application app.js ---- //
const app = require("./app");

// ---- Vérification du port si il est valide ---- //
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// ---- Paramètrage du port avec la méthode set de express ---- //
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

const errorHandler = (error) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === "string" ? "pipe " + address : "port: " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges.");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use.");
      process.exit(1);
      break;
    default:
      throw error;
  }
};
// ---- La méthode createServer() prend en argument la fonction appelé à chaque requête reçu par le serveur. Les fonctions se situant dans app.js
const server = http.createServer(app);

// ---- En cas d'erreur redirige vers errorHandler ---- //
server.on("error", errorHandler);
server.on("listening", () => {
  const address = server.address();
  const bind = typeof address === "string" ? "pipe " + address : "port " + port;
  console.log("Listening on " + bind);
});

// ---- Le serveur écoute les requêtes sur le port ---- //
server.listen(port);
