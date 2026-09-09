import "dotenv/config";
import { Redis } from "@upstash/redis";

async function main() {
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });
    console.log("Limpiando rate limits en Redis...");
    const keys = await redis.keys("*");
    let count = 0;
    for (const key of keys) {
      if (key.includes("sign-in") || key.includes("rate-limit")) {
        await redis.del(key);
        count++;
      }
    }
    console.log(`Borradas ${count} llaves de bloqueo.`);
  } else {
    console.log("No hay Redis configurado.");
  }
  process.exit(0);
}
main().catch(console.error);
