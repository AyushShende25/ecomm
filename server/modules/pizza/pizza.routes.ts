import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { StatusCodes } from "http-status-codes";
import postgres from "postgres";

import { pizzaInsertSchema, pizzaUpdateSchema } from "@/db/schema/pizzas";
import {
  deletePizza,
  getAllPizzas,
  getPizza,
  insertPizza,
  updatePizza,
} from "@/modules/pizza/pizza.dal";

const app = new Hono()
  .get("/", async (c) => {
    const pizzaList = await getAllPizzas();
    return c.json(
      {
        success: true,
        data: pizzaList,
      },
      StatusCodes.OK,
    );
  })
  .post(zValidator("json", pizzaInsertSchema), async (c) => {
    try {
      const insertData = c.req.valid("json");
      const [newPizza] = await insertPizza(insertData);
      return c.json(
        {
          success: true,
          data: newPizza,
        },
        StatusCodes.CREATED,
      );
    } catch (error) {
      if (error instanceof postgres.PostgresError && error.code === "23505") {
        throw new HTTPException(StatusCodes.CONFLICT, {
          message: "Pizza with that name already exists",
        });
      }
      throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: "Error creating pizza",
      });
    }
  })
  .get(":pizzaId", async (c) => {
    const { pizzaId } = c.req.param();
    const [pizza] = await getPizza(pizzaId);
    if (!pizza) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "Pizza not found",
      });
    }

    return c.json(
      {
        success: true,
        data: pizza,
      },
      StatusCodes.OK,
    );
  })
  .patch(":pizzaId", zValidator("json", pizzaUpdateSchema), async (c) => {
    try {
      const { pizzaId } = c.req.param();
      const [existingPizza] = await getPizza(pizzaId);
      if (!existingPizza) {
        throw new HTTPException(StatusCodes.NOT_FOUND, {
          message: "Pizza does not exist",
        });
      }

      const updateData = c.req.valid("json");
      if (Object.keys(updateData).length === 0) {
        throw new HTTPException(StatusCodes.BAD_REQUEST, {
          message: "No fields provided for update",
        });
      }
      const [updatedPizza] = await updatePizza(pizzaId, updateData);
      return c.json(
        {
          success: true,
          data: updatedPizza,
        },
        StatusCodes.OK,
      );
    } catch (error) {
      if (error instanceof postgres.PostgresError && error.code === "23505") {
        throw new HTTPException(StatusCodes.CONFLICT, {
          message: "Pizza with that name already exists",
        });
      }
      throw new HTTPException(StatusCodes.INTERNAL_SERVER_ERROR, {
        message: "Error updating pizza",
      });
    }
  })
  .delete(":pizzaId", async (c) => {
    const { pizzaId } = c.req.param();
    const [existingPizza] = await getPizza(pizzaId);
    if (!existingPizza) {
      throw new HTTPException(StatusCodes.NOT_FOUND, {
        message: "Pizza does not exist",
      });
    }

    await deletePizza(pizzaId);
    return c.json({}, StatusCodes.NO_CONTENT);
  });

export default app;
