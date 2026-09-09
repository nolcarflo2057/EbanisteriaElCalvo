import { z } from "zod";

export const ValidSizesSchema = z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL']);
export const ValidTypesSchema = z.enum(['sweatshirt', 'jacket', 'shirt', 'hoodie', 'pullover', 'jogger', 'tee', 'onesie', 'hats']);
export const GenderSchema = z.enum(['men', 'women', 'kid', 'unisex']);

export const SeedProductSchema = z.object({
  description: z.string(),
  images: z.array(z.string()).nonempty(),
  inStock: z.number().int().min(0),
  price: z.number().positive(),
  compareAtPrice: z.number().positive().optional(),
  sizes: z.array(ValidSizesSchema).nonempty(),
  slug: z.string().min(1),
  tags: z.array(z.string()),
  title: z.string().min(1),
  type: ValidTypesSchema,
  gender: GenderSchema,
  category: GenderSchema,
  isFeatured: z.boolean().optional(),
  isBestseller: z.boolean().optional(),
  rating: z.number().min(0).max(5).optional(),
  color: z.array(z.string()).optional(),
});

export const InitialDataSchema = z.array(SeedProductSchema);

export const VariantAttributesSchema = z.object({
  categorySlug: z.string(),
  sizes: z.array(z.string()).nonempty(),
  color: z.array(z.string()),
  images: z.array(z.string()).nonempty(),
});

export const VariantInsertSchema = z.object({
  storeId: z.string().uuid(),
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string(),
  price: z.number().int().nonnegative(),
  compareAtPrice: z.number().int().nonnegative().nullable(),
  stock: z.number().int().nonnegative(),
  soldCount: z.number().int().nonnegative(),
  imageUrl: z.string(),
  categoryId: z.string().uuid(),
  gender: GenderSchema,
  tags: z.array(z.string()),
  isFeatured: z.boolean(),
  isBestseller: z.boolean(),
  rating: z.number().int().min(0).max(5).nullable(),
  attributes: VariantAttributesSchema,
  sku: z.string().min(1),
});

export const ResultingVariantsSchema = z.array(VariantInsertSchema);
