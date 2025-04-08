const fs = require("fs");
const { STATUS } = require("../constants/statusCode");

module.exports = (req, res) => {
  if (req.method === "GET" && req.url === "/product/add") {
    res.writeHead(STATUS.OK, { "Content-Type": "text/html" });
    res.end(`
      <h1>Add Product</h1>
      <form method="POST" action="/product/add">
        <input type="text" name="product" placeholder="Product name" required />
        <button type="submit">Add</button>
      </form>
      <br>
      <a href="/product/list">View Product List</a>
    `);
  }

  else if (req.method === "POST" && req.url === "/product/add") {
    let body = "";
    req.on("data", chunk => body += chunk.toString());
    req.on("end", () => {
      const product = new URLSearchParams(body).get("product");
      fs.appendFile("product.txt", product + "\n", err => {
        if (err) {
          res.writeHead(STATUS.INTERNAL_SERVER_ERROR);
          res.end("Server Error");
        } else {
          res.writeHead(STATUS.FOUND, { Location: "/product/list" });
          res.end();
        }
      });
    });
  }

  else if (req.method === "GET" && req.url === "/product/list") {
    fs.readFile("product.txt", "utf8", (err, data) => {
      if (err) {
        res.writeHead(STATUS.INTERNAL_SERVER_ERROR);
        res.end("Server Error");
      } else {
        const items = data
          .split("\n")
          .filter(Boolean)
          .map((item, index) => `
            <li>
              ${item}
              <form method="POST" action="/product/delete" style="display:inline;">
                <input type="hidden" name="index" value="${index}">
                <button type="submit">Delete</button>
              </form>
            </li>
          `)
          .join("");

        res.writeHead(STATUS.OK, { "Content-Type": "text/html" });
        res.end(`
          <h1>Product List</h1>
          <ul>${items}</ul>
          <br>
          <a href="/product/add">Add More</a>
        `);
      }
    });
  }

  else if (req.method === "POST" && req.url === "/product/delete") {
    let body = "";
    req.on("data", chunk => body += chunk.toString());
    req.on("end", () => {
      const index = parseInt(new URLSearchParams(body).get("index"), 10);
      fs.readFile("product.txt", "utf8", (err, data) => {
        if (err) {
          res.writeHead(STATUS.INTERNAL_SERVER_ERROR);
          res.end("Server Error");
        } else {
          const lines = data.split("\n").filter(Boolean);
          lines.splice(index, 1);
          fs.writeFile("product.txt", lines.join("\n") + "\n", err => {
            if (err) {
              res.writeHead(STATUS.INTERNAL_SERVER_ERROR);
              res.end("Server Error");
            } else {
              res.writeHead(STATUS.FOUND, { Location: "/product/list" });
              res.end();
            }
          });
        }
      });
    });
  }

  else {
    res.writeHead(STATUS.NOT_FOUND, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
};
