import { type Config } from "drizzle-kit";

import { env } from "~/env";

console.log("DATABASE_URL", env.DATABASE_URL);

export default {
  schema: "./src/server/db/schema.ts",
  driver: "pg",
  dbCredentials: {
    connectionString: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
  // tablesFilter: ["remembo_*"],
} satisfies Config;
