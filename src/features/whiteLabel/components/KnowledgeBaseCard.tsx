"use client";

import { useEffect, useState } from "react";
import {
	listKnowledgeAction,
	listPendingAction,
	upsertKnowledgeAction,
	deleteKnowledgeAction,
	answerPendingAction,
} from "@/features/whiteLabel/actions/chatbot-knowledge.actions";

interface Entry {
	id: string;
	question: string;
	answer: string;
	source: string;
	enabled: boolean;
}

interface Pending {
	id: string;
	question: string;
	askedCount: number;
	status: string;
	createdAt: string;
	lastAskedAt: string;
}

export function KnowledgeBaseCard() {
	const [entries, setEntries] = useState<Entry[]>([]);
	const [pending, setPending] = useState<Pending[]>([]);
	const [q, setQ] = useState("");
	const [a, setA] = useState("");
	const [busy, setBusy] = useState(false);
	const [err, setErr] = useState("");
	const [answeringId, setAnsweringId] = useState<string | null>(null);
	const [ansText, setAnsText] = useState("");

	async function load() {
		try {
			const [e, p] = await Promise.all([listKnowledgeAction(), listPendingAction()]);
			setEntries(e as Entry[]);
			setPending(p as Pending[]);
		} catch (e: unknown) {
			setErr(e instanceof Error ? e.message : "Error cargando");
		}
	}

	useEffect(() => {
		void load();
	}, []);

	async function add() {
		setErr("");
		setBusy(true);
		try {
			await upsertKnowledgeAction(q, a);
			setQ("");
			setA("");
			await load();
		} catch (e: unknown) {
			setErr(e instanceof Error ? e.message : "Error");
		} finally {
			setBusy(false);
		}
	}

	async function del(id: string) {
		await deleteKnowledgeAction(id);
		await load();
	}

	async function answer(id: string, question: string) {
		setErr("");
		setBusy(true);
		try {
			await answerPendingAction(id, question, ansText);
			setAnsweringId(null);
			setAnsText("");
			await load();
		} catch (e: unknown) {
			setErr(e instanceof Error ? e.message : "Error");
		} finally {
			setBusy(false);
		}
	}

	return (
		<section className="space-y-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
			<div>
				<h2 className="text-base font-semibold text-foreground">Base de conocimiento del negocio</h2>
				<p className="text-xs text-muted-foreground">
					Datos que el chatbot (modo avanzado) usa para responder. También se alimenta desde el chat de
					entrenamiento cuando eres dueño.
				</p>
			</div>

			{err && <p className="text-xs text-destructive">{err}</p>}

			<div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
				<input
					value={q}
					onChange={(e) => setQ(e.target.value)}
					placeholder="Pregunta (ej: ¿Hacen cocinas integrales?)"
					className="h-10 rounded-lg border border-border bg-surface-container-low px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
				/>
				<input
					value={a}
					onChange={(e) => setA(e.target.value)}
					placeholder="Respuesta"
					className="h-10 rounded-lg border border-border bg-surface-container-low px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
				/>
				<button
					type="button"
					disabled={busy}
					onClick={() => void add()}
					className="h-10 rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity disabled:opacity-50"
				>
					Agregar
				</button>
			</div>

			<div className="space-y-2">
				{entries.length === 0 && (
					<p className="text-xs text-muted-foreground">Aún no hay datos en la base de conocimiento.</p>
				)}
				{entries.map((e) => (
					<div
						key={e.id}
						className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface-container-low p-3"
					>
						<div className="min-w-0">
							<p className="text-sm font-medium text-foreground">{e.question}</p>
							<p className="text-xs text-muted-foreground">{e.answer}</p>
						</div>
						<button
							type="button"
							onClick={() => void del(e.id)}
							className="shrink-0 text-xs text-destructive hover:underline"
						>
							Eliminar
						</button>
					</div>
				))}
			</div>

			{pending.length > 0 && (
				<div className="space-y-2 border-t border-border pt-4">
					<h3 className="text-sm font-semibold text-foreground">Preguntas de clientes sin responder</h3>
					{pending.map((p) => (
						<div key={p.id} className="rounded-lg border border-border bg-surface-container-low p-3">
							<div className="flex items-center justify-between gap-2">
								<p className="text-sm text-foreground">“{p.question}”</p>
								<span className="shrink-0 text-[10px] text-muted-foreground">×{p.askedCount}</span>
							</div>
							{answeringId === p.id ? (
								<div className="mt-2 flex gap-2">
									<input
										value={ansText}
										onChange={(e) => setAnsText(e.target.value)}
										placeholder="Respuesta para guardar en la base de conocimiento"
										className="h-9 flex-1 rounded-lg border border-border bg-surface-container-low px-3 text-sm text-foreground outline-none focus:ring-2 focus:ring-primary"
									/>
									<button
										type="button"
										disabled={busy}
										onClick={() => void answer(p.id, p.question)}
										className="h-9 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground disabled:opacity-50"
									>
										Guardar
									</button>
								</div>
							) : (
								<button
									type="button"
									onClick={() => {
										setAnsweringId(p.id);
										setAnsText("");
									}}
									className="mt-2 text-xs font-medium text-primary hover:underline"
								>
									Responder y guardar
								</button>
							)}
						</div>
					))}
				</div>
			)}
		</section>
	);
}


