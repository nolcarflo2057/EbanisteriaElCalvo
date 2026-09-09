import { ImageResponse } from "@vercel/og";

export const runtime = "edge";
export const alt = "Carvin Shop | E-Commerce Full-Stack Platform";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
	return new ImageResponse(
		(
			<div
				style={{
					background: "linear-gradient(135deg, #09090b 0%, #18181b 50%, #09090b 100%)",
					width: "100%",
					height: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					fontFamily: "sans-serif",
					padding: "60px",
					position: "relative",
					color: "white",
				}}
			>
				{/* Glowing accent background blur */}
				<div
					style={{
						position: "absolute",
						top: "-80px",
						right: "-80px",
						width: "450px",
						height: "450px",
						borderRadius: "50%",
						background: "rgba(249, 115, 22, 0.2)",
						filter: "blur(90px)",
					}}
				/>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						gap: "20px",
						marginBottom: "24px",
					}}
				>
					<div
						style={{
							width: "76px",
							height: "76px",
							borderRadius: "20px",
							background: "#f97316",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							fontSize: "44px",
							fontWeight: 900,
							color: "white",
							boxShadow: "0 12px 30px rgba(249, 115, 22, 0.4)",
						}}
					>
						C
					</div>
					<h1
						style={{
							fontSize: "72px",
							fontWeight: 900,
							letterSpacing: "-0.03em",
							color: "#ffffff",
							margin: 0,
						}}
					>
						Carvin Shop
					</h1>
				</div>

				<p
					style={{
						fontSize: "30px",
						color: "#a1a1aa",
						margin: "0 0 44px 0",
						textAlign: "center",
						maxWidth: "900px",
						fontWeight: 500,
					}}
				>
					Plataforma E-Commerce Full-Stack &amp; Panel Administrativo
				</p>

				<div
					style={{
						display: "flex",
						gap: "14px",
						alignItems: "center",
					}}
				>
					{["Next.js 15", "TypeScript", "PostgreSQL", "Drizzle ORM", "PayPal / Mercado Pago"].map((tech) => (
						<span
							key={tech}
							style={{
								background: "rgba(255, 255, 255, 0.08)",
								border: "1px solid rgba(255, 255, 255, 0.15)",
								padding: "10px 22px",
								borderRadius: "999px",
								fontSize: "18px",
								fontWeight: 600,
								color: "#f4f4f5",
							}}
						>
							{tech}
						</span>
					))}
				</div>

				<div
					style={{
						position: "absolute",
						bottom: "40px",
						display: "flex",
						alignItems: "center",
						gap: "8px",
						fontSize: "20px",
						fontWeight: 600,
						color: "#f97316",
					}}
				>
					<span>Desarrollado por Jhonatan Cardona Duarte</span>
				</div>
			</div>
		),
		{ ...size }
	);
}
