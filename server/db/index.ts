import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

import { env } from "@/config/env";

const queryClient = postgres(env.DATABASE_URL);
const db = drizzle({ client: queryClient });

const result = await db.execute("select 1");
