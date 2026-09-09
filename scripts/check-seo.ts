import { db } from "../src/db/index";
import { storeSettings } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function checkSettings() {
  const settings = await db.select().from(storeSettings);
  console.log(JSON.stringify(settings, null, 2));
}

checkSettings().catch(console.error);
