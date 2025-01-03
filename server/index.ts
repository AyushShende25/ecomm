import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { logger } from "hono/logger";
import { prettyJSON } from "hono/pretty-json";
import { StatusCodes } from "http-status-codes";

import { env } from "@/config/env";
import pizzaRoutes from "@/modules/pizza/pizza.routes";

const app = new Hono({ strict: false }).basePath("/api");

app.use(logger());
app.use(prettyJSON());

app.get("/health", (c) =>
  c.json({
    message: "ok",
  }),
);

app.route("/pizza", pizzaRoutes);

app.onError((err, c) => {
  if (err instanceof HTTPException) {
    const errResponse =
      err.res ??
      c.json(
        {
          success: false,
          error: err.message,
        },
        err.status,
      );
    return errResponse;
  }
  console.log(err);
  return c.json(
    {
      success: false,
      error:
        env.NODE_ENV === "production"
          ? "Internal server error"
          : (err.stack ?? err.message),
    },
    StatusCodes.INTERNAL_SERVER_ERROR,
  );
});

app.notFound((c) => {
  return c.json(
    {
      success: false,
      error: "Resource not found",
    },
    StatusCodes.NOT_FOUND,
  );
});

export default {
  port: 5001,
  fetch: app.fetch,
};
