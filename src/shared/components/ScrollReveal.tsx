"use client";

import { useEffect, useRef, useState, ReactNode } from "react";

interface Props {
	children: ReactNode;
	delay?: number;
	duration?: number;
	className?: string;
}

export function ScrollReveal({ children, delay = 0, duration = 800, className = "" }: Props) {
	const ref = useRef<HTMLDivElement>(null);
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setIsVisible(true);
					observer.unobserve(entry.target);
				}
			},
			{
				threshold: 0.1,
				rootMargin: "0px 0px -50px 0px", // Trigger slightly before the element fully enters viewport
			}
		);

		if (ref.current) {
			observer.observe(ref.current);
		}

		return () => {
			observer.disconnect();
		};
	}, []);

	return (
		<div
			ref={ref}
			style={{
				transitionDuration: `${duration}ms`,
				transitionDelay: `${delay}ms`,
			}}
			className={`transition-all ease-[cubic-bezier(0.16,1,0.3,1)] transform ${
				isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-6 scale-[0.98]"
			} ${className}`}
		>
			{children}
		</div>
	);
}
