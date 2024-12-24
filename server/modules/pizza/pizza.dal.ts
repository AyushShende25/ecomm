import { eq } from "drizzle-orm";

import { db } from "@/db";
import {
  type PizzaInsertInput,
  type PizzaUpdateInput,
  pizzasTable,
} from "@/db/schema/pizzas";

export const insertPizza = async (pizzaInsertInput: PizzaInsertInput) => {
  return await db.insert(pizzasTable).values(pizzaInsertInput).returning();
};

export const getAllPizzas = async () => {
  return await db.select().from(pizzasTable);
};

export const getPizza = async (pizzaId: string) => {
  return await db.select().from(pizzasTable).where(eq(pizzasTable.id, pizzaId));
};

export const updatePizza = async (
  pizzaId: string,
  pizzaUpdateInput: PizzaUpdateInput,
) => {
  return await db
    .update(pizzasTable)
    .set(pizzaUpdateInput)
    .where(eq(pizzasTable.id, pizzaId))
    .returning();
};

export const deletePizza = async (pizzaId: string) => {
  return await db.delete(pizzasTable).where(eq(pizzasTable.id, pizzaId));
};
