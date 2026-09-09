export interface Vertical {
  id: string;
  name: string;
  slug: string;
  landing?: {
    footer?: {
      brand?: string;
      tagline?: string;
      copyright?: string;
      linkGroups?: Array<{
        title: string;
        links: Array<{ label: string; href: string }>;
      }>;
    };
  };
}

export class VerticalService {
  static async getActiveVertical(tenantId: string): Promise<Vertical | null> {
    // Mock implementation - returns null to use default landing footer
    return null;
  }
}