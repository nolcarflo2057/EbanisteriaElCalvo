export interface AuditParams {
	userId?: string | null; // Quién realiza la acción
	action: string; // "CREATE", "UPDATE", "DELETE", etc.
	entity: string; // Entidad afectada ("product", "user", "order", etc.)
	entityId?: string; // ID del registro afectado
	metadata?: Record<string, any>; // Cambios realizados o información adicional
}
