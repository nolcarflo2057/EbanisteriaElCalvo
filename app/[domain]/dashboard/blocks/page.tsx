import { requireAuth } from "@/lib/auth/auth-server";
import { redirect } from "next/navigation";
import { RolesService } from "@/features/roles/services/roles.service";
import { BlockEditor } from "@/features/blocks/components/BlockEditor";
import { LivePreviewButton } from "@/features/blocks/components/LivePreviewButton";

export default async function CMSBlocksPage() {
  const authResult = await requireAuth();

  if (!authResult.isAuth || !authResult.session) {
    redirect("/");
  }

  const isAdmin = false;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Editor de Bloques</h1>
          <p className="text-muted-foreground mt-2">
            {isAdmin
              ? "Construye la home de tu tienda con bloques dinámicos sin tocar código"
              : "Edita el contenido de los bloques habilitados en tu tienda"}
          </p>
        </div>
        <LivePreviewButton />
      </div>
      <BlockEditor pageKey="home" isAdmin={isAdmin} />
    </div>
  );
}
