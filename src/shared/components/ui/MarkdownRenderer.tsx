import React from "react";

interface Props {
	content: string;
}

export function MarkdownRenderer({ content }: Props) {
	if (!content) return null;

	// Split content by double linebreaks for paragraphs/headings/lists
	const sections = content.split(/\n\s*\n/);

	const parseInline = (text: string) => {
		const parts = [];
		const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
		let match;
		let lastIndex = 0;

		while ((match = regex.exec(text)) !== null) {
			const startIndex = match.index;
			if (startIndex > lastIndex) {
				parts.push(text.substring(lastIndex, startIndex));
			}

			const token = match[0];
			if (token.startsWith("**") && token.endsWith("**")) {
				parts.push(<strong key={startIndex} className="font-bold text-foreground">{token.slice(2, -2)}</strong>);
			} else {
				const linkMatch = /\[(.*?)\]\((.*?)\)/.exec(token);
				if (linkMatch) {
					parts.push(
						<a
							key={startIndex}
							href={linkMatch[2]}
							className="text-primary hover:underline font-semibold"
							target="_blank"
							rel="noopener noreferrer"
						>
							{linkMatch[1]}
						</a>
					);
				} else {
					parts.push(token);
				}
			}
			lastIndex = regex.lastIndex;
		}

		if (lastIndex < text.length) {
			parts.push(text.substring(lastIndex));
		}

		return parts.length > 0 ? parts : text;
	};

	return (
		<div className="space-y-6 text-sm text-foreground/90 leading-relaxed">
			{sections.map((section, idx) => {
				const trimmed = section.trim();
				if (!trimmed) return null;

				if (trimmed.startsWith("# ")) {
					return (
						<h1 key={idx} className="text-2xl font-bold text-foreground mt-8 mb-4 border-b border-border pb-2">
							{trimmed.slice(2)}
						</h1>
					);
				}

				if (trimmed.startsWith("## ")) {
					return (
						<h2 key={idx} className="text-xl font-bold text-foreground mt-6 mb-3">
							{trimmed.slice(3)}
						</h2>
					);
				}

				if (trimmed.startsWith("### ")) {
					return (
						<h3 key={idx} className="text-lg font-bold text-foreground mt-4 mb-2">
							{trimmed.slice(4)}
						</h3>
					);
				}

				if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
					const lines = trimmed.split("\n").map((line) => line.replace(/^[-*]\s+/, ""));
					return (
						<ul key={idx} className="list-disc list-inside space-y-2 ml-4">
							{lines.map((line, lineIdx) => (
								<li key={lineIdx}>{parseInline(line)}</li>
							))}
						</ul>
					);
				}

				return (
					<p key={idx}>
						{parseInline(trimmed)}
					</p>
				);
			})}
		</div>
	);
}


