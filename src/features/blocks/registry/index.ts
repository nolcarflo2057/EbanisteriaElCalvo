import type { BlockDefinition, BlockSchema } from "../types/schema";
import { heroBlock } from "../blocks/hero/hero.block";
import { featuresBlock } from "../blocks/features/features.block";
import { ctaBlock } from "../blocks/cta/cta.block";
import { categoriesBlock } from "../blocks/categories/categories.block";
import { stepsBlock } from "../blocks/steps/steps.block";
import { footerBlock } from "../blocks/footer/footer.block";
import { aboutBlock } from "../blocks/about/about.block";
import { testimonialsBlock } from "../blocks/testimonials/testimonials.block";
import { pricingBlock } from "../blocks/pricing/pricing.block";
import { faqBlock } from "../blocks/faq/faq.block";
import { galleryBlock } from "../blocks/gallery/gallery.block";
import { contactBlock } from "../blocks/contact/contact.block";
import { statsBlock } from "../blocks/stats/stats.block";
import { containerBlock } from "../blocks/container/container.block";
import { servicesGridBlock } from "../blocks/services-grid/services-grid.block";
import { splitSectionBlock } from "../blocks/split-section/split-section.block";
import { locationHoursBlock } from "../blocks/location-hours/location-hours.block";
import { contactFormBlock } from "../blocks/contact-form/contact-form.block";
import { artisanShowcaseBlock } from "../blocks/artisan-showcase/artisan-showcase.block";
import { serviceCardBlock } from "../blocks/service-card/service-card.block";
import { navigationBlock } from "../blocks/navigation/navigation.block";
/**
 * Registro de bloques disponibles en el código. Cada bloque auto-declara su schema.
 * Para añadir un bloque nuevo al motor: crea su BlockDefinition y regístralo aquí.
 */
export const blockRegistry: Record<string, BlockDefinition<any>> = {
	[heroBlock.schema.type]: heroBlock,
	[featuresBlock.schema.type]: featuresBlock,
	[ctaBlock.schema.type]: ctaBlock,
	[categoriesBlock.schema.type]: categoriesBlock,
	[stepsBlock.schema.type]: stepsBlock,
	[footerBlock.schema.type]: footerBlock,
	[aboutBlock.schema.type]: aboutBlock,
	[testimonialsBlock.schema.type]: testimonialsBlock,
	[pricingBlock.schema.type]: pricingBlock,
	[faqBlock.schema.type]: faqBlock,
	[galleryBlock.schema.type]: galleryBlock,
	[contactBlock.schema.type]: contactBlock,
	[statsBlock.schema.type]: statsBlock,
	[containerBlock.schema.type]: containerBlock,
	[servicesGridBlock.schema.type]: servicesGridBlock,
	[splitSectionBlock.schema.type]: splitSectionBlock,
	[locationHoursBlock.schema.type]: locationHoursBlock,
	[contactFormBlock.schema.type]: contactFormBlock,
	[artisanShowcaseBlock.schema.type]: artisanShowcaseBlock,
	[serviceCardBlock.schema.type]: serviceCardBlock,
	[navigationBlock.schema.type]: navigationBlock,
};

/** Schemas de los bloques de código (sin overrides de tienda). */
export function getCodeBlockSchemas(): BlockSchema[] {
  return Object.values(blockRegistry).map((def) => ({
    ...def.schema,
    defaultProps: def.defaultProps,
  }));
}

/**
 * Resuelve el schema de un bloque: primero busca overrides de la tienda
 * (stores.blockSchemas), luego cae al registry de código.
 */
export function resolveBlockSchema(
	blockType: string,
	storeSchemas: BlockSchema[] = [],
): BlockSchema | undefined {
	const override = storeSchemas.find((s) => s.type === blockType);
	if (override) return override;
	return blockRegistry[blockType]?.schema;
}

/** Todos los schemas disponibles para una tienda (código + overrides). */
export function getAllBlockSchemas(storeSchemas: BlockSchema[] = []): BlockSchema[] {
	const code = getCodeBlockSchemas();
	const custom = storeSchemas.filter((s) => !code.some((c) => c.type === s.type));
	return [...code, ...custom];
}
