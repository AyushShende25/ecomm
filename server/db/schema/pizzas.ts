import {
  numeric,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import type { z } from "zod";

export const pizzasTable = pgTable("pizzas", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 255 }).notNull().unique(),
  description: text(),
  price: numeric({ precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdate(() => new Date()),
});

export const pizzaInsertSchema = createInsertSchema(pizzasTable, {
  name: (schema) => schema.min(1).max(255),
  description: (schema) => schema.max(1000),
  price: (schema) =>
    schema.refine((val) => Number.parseFloat(val) > 0, {
      message: "Price must be greater than zero",
    }),
  imageUrl: (schema) => schema.url("Invalid image url"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const pizzaUpdateSchema = pizzaInsertSchema.partial();

export type PizzaInsertInput = z.infer<typeof pizzaInsertSchema>;

export type PizzaUpdateInput = z.infer<typeof pizzaUpdateSchema>;
