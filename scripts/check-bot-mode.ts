import { db } from "../src/db";
import { whiteLabelConfig } from "../src/db/schema/white_label_config";

async function main() {
    const configs = await db.select().from(whiteLabelConfig);
    console.log("Configuraciones de chatbot:", configs.map(c => ({ tenantId: c.tenantId, mode: c.chatbotMode })));
}
main().catch(console.error);
