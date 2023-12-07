// import pkgs
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const { version } = require("../package.json");
// setup and intialization

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Savoir Care API",
      description:
        "This is the API documentation for Savaoir Care, an e-commerce website.",
      version,
    },
    servers: [
      {
        url: "https://temporal-state-363009.rj.r.appspot.com/",
        description: "GCP server",
      },
      {
        url: "https://e-store-server.cyclic.app/",
        description: "Cyclic server",
      },
    ],
  },
  apis: ["./routes/*.js", "./models/*.js"],
};
const swaggerSpec = swaggerJsdoc(options);
function swaggerDocs(app, port) {
  // Swagger Page
  app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // JSON Doc
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
}

module.exports = { swaggerDocs };
