const assert = require("assert");
const { describe, it } = require("mocha");
const app = require("../index");
const request = require("supertest")(app);
// request = request(app);
// describe("Testing", () => {
//   it("Should pass", () => {
//     return true;
//   });
// });

describe("GET/ Products", () => {
  it("Should return a status code", async () => {
    await request
      .get("/products")
      .set("Origin", "https://e-store-client.vercel.app")
      .then((res) => {
        assert(res.statusCode === 200);
        assert(!res.error.status);
      });
    //   .expect(200);
  });
  it("Should return an error when Origin header is not set", async () => {
    await request.get("/products").then((res) => {
      // console.log("The response error: " + res.error);
      assert(res.error.status);
    });
    //   .expect(400);
  });
});

describe("Authentication", () => {
  it("Return an error when request body is empty", async () => {
    await request
      .post("/auth/login")
      .set("Origin", "https://e-store-client.vercel.app")
      .then((res) => {
        console.log(res.body);
        assert(res.statusCode === 400);
      });
  });
  it("Return an error when request body does not contain Email field", async () => {
    await request
      .post("/auth/login")
      .set("Origin", "https://e-store-client.vercel.app")
      .send({ key: "value" })
      .then((res) => {
        console.log(res.body);
        assert(res.statusCode === 400);
      });
  });
  it("Return an error when request body does not contain Password field", async () => {
    await request
      .post("/auth/login")
      .set("Origin", "https://e-store-client.vercel.app")
      .send({ email: "value" })
      .then((res) => {
        console.log(res.body);
        assert(res.statusCode === 400);
      });
  });
});
