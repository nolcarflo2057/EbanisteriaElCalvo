import type { MockStep } from "@/features/landing/constants/mock-cms";

export interface LandingStepsProps {
	title: string;
	subtitle: string;
	steps: MockStep[];
}
