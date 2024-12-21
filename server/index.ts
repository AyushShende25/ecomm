import { Hono } from "hono";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";

const app = new Hono();
app.use(logger());
app.use(prettyJSON());

app.get("/health", (c) => c.json({
  message:"ok"
}));

export default {
  port: 5001,
  fetch: app.fetch,
};
