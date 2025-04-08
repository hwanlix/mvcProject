const http = require("http");
const home = require("./routing/home");
const logout = require("./routing/logout");
const product = require("./routing/product");
const { STATUS } = require("./constants/statusCode");

const server = http.createServer((req, res) => {
  if (req.url === "/" && req.method === "GET") {
    home(req, res);
  } else if (
    req.url === "/product/add" ||
    req.url === "/product/list"
  ) {
    product(req, res);
  } else if (req.url === "/logout" && req.method === "GET") {
    logout(req, res);
  } else {
    res.writeHead(STATUS.NOT_FOUND, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});
