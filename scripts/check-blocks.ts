import { db } from '../src/db';
import { tenantPageBlocks, tenants } from '../src/db/schema/core';
import { eq } from 'drizzle-orm';

async function main() {
  const t = await db.select().from(tenants).limit(1);
  console.log('tenant:', JSON.stringify(t[0] ? { id: t[0].id, slug: (t[0] as any).slug } : null));
  
  if (!t[0]) { console.log('No hay tenant'); process.exit(0); }
  
  const b = await db.select().from(tenantPageBlocks).where(eq(tenantPageBlocks.tenantId, t[0].id));
  console.log('bloques en BD:', JSON.stringify(b.map(x => ({ type: x.blockType, visible: x.visible, order: x.order, label: x.label }))));
  process.exit(0);
}

main().catch(e => { console.error(e); process.exit(1); });
