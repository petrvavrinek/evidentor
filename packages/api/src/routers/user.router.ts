import { Hono } from "hono";

const app = new Hono().get("/", async (c) => {
  return c.text("This is user route");
});

export { app as userApp };
