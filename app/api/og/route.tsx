import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
	try {
		const { searchParams } = new URL(req.url);

		// Dynamic params
		const title = searchParams.get("title") ?? "Ebanistería El Calvo";
		const subtitle = searchParams.get("subtitle") ?? "Restauración y Ebanistería en Pereira";

		return new ImageResponse(
			(
				<div
					style={{
						height: "100%",
						width: "100%",
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						backgroundColor: "#fbf9f5", // var(--background)
						backgroundImage: "radial-gradient(circle at 25px 25px, #d0c5b4 2%, transparent 0%), radial-gradient(circle at 75px 75px, #d0c5b4 2%, transparent 0%)",
						backgroundSize: "100px 100px",
					}}
				>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							alignItems: "center",
							justifyContent: "center",
							backgroundColor: "rgba(255, 255, 255, 0.9)",
							padding: "60px 80px",
							borderRadius: "20px",
							boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
							border: "4px solid #B45309", // var(--primary)
							maxWidth: "1000px",
							textAlign: "center",
						}}
					>
						<h1
							style={{
								fontSize: "72px",
								fontWeight: "bold",
								color: "#1c1b18", // var(--on-background)
								marginBottom: "20px",
								lineHeight: 1.1,
								fontFamily: "sans-serif",
							}}
						>
							{title}
						</h1>
						<p
							style={{
								fontSize: "36px",
								color: "#B45309", // var(--primary)
								margin: 0,
								fontWeight: 500,
								fontFamily: "sans-serif",
							}}
						>
							{subtitle}
						</p>
					</div>
					
					<div
						style={{
							position: "absolute",
							bottom: 40,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							width: "100%",
						}}
					>
						<span
							style={{
								fontSize: "28px",
								color: "#4d4639",
								fontWeight: "bold",
								backgroundColor: "white",
								padding: "10px 24px",
								borderRadius: "30px",
								border: "2px solid #e6e2da",
								fontFamily: "sans-serif",
							}}
						>
							📍 Pereira, Risaralda
						</span>
					</div>
				</div>
			),
			{
				width: 1200,
				height: 630,
			}
		);
	} catch (e: any) {
		console.log(`${e.message}`);
		return new Response(`Failed to generate the image`, {
			status: 500,
		});
	}
}
