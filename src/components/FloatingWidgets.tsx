"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useWhiteLabelConfig, type ConfigData } from "@/features/whiteLabel/hooks/useWhiteLabelConfig";
import { answerPendingAction } from "@/features/whiteLabel/actions/chatbot-knowledge.actions";
import { DEFAULT_SIMPLE_CHATBOT_TAGS } from "@/features/whiteLabel/constants/chatbot.constants";
import { useSession } from "@/lib/auth/auth-client";
import { cn } from "@/shared/utils/cn";
import { useTenantTheme } from "@/core/tenant/useTenantTheme";
import { resolveWidgetClasses } from "@/core/tenant/resolve-styles";

interface ChatMessage {
  id: string;
  sender: "user" | "agent";
  content: string;
  createdAt: string;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

function MinimizeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  );
}

/**
 * Botón flotante de WhatsApp. Se muestra si showWhatsapp=true y hay whatsappNumber.
 * La forma del widget se resuelve dinámicamente desde TenantThemeConfig.
 */
function WhatsAppButton({ config, widgetClasses }: { config: ConfigData; widgetClasses: string }) {
  const number = config.whatsappNumber?.replace(/\D/g, "") ?? "";
  const message = config.whatsappMessage || "Hola, me interesaría solicitar un presupuesto o cotización para sus servicios.";
  const href = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

  if (!number) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
      className={cn(
        "group flex h-14 w-14 items-center justify-center bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#25D366] focus:ring-offset-2",
        widgetClasses
      )}
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
        Escríbenos por WhatsApp
      </span>
    </a>
  );
}

function GearIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

/**
 * Botón flotante de acceso al dashboard. Solo se muestra si hay sesión activa.
 * La forma del widget se resuelve dinámicamente desde TenantThemeConfig.
 */
function DashboardButton({ widgetClasses }: { widgetClasses: string }) {
  const { data: session, isPending } = useSession();
  if (isPending || !session?.user) return null;

  return (
    <Link
      href="/dashboard"
      aria-label="Ir al panel de administración"
      className={cn(
        "group flex h-14 w-14 items-center justify-center bg-secondary text-on-secondary shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-secondary focus:ring-offset-2",
        widgetClasses
      )}
    >
      <GearIcon className="h-6 w-6" />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-foreground px-3 py-1.5 text-xs font-semibold text-background opacity-0 shadow-md transition-opacity duration-200 group-hover:opacity-100">
        Panel de administración
      </span>
    </Link>
  );
}

/**
 * Widget de chatbot. Se muestra si showChatbot=true. Persiste los mensajes
 * en la tabla chat_messages a través de la API /api/chat.
 * La forma del widget se resuelve dinámicamente desde TenantThemeConfig.
 */
function ChatbotWidget({ config, widgetClasses }: { config: ConfigData; widgetClasses: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [pending, setPending] = useState<{ id: string; question: string; askedCount: number }[]>([]);
  const [trainingId, setTrainingId] = useState<string | null>(null);
  const [trainingAnswer, setTrainingAnswer] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { data: session } = useSession();
  const { businessName } = config;

  const isAdmin =
    !!session?.user &&
    (session.user as { role?: string; activeTenantId?: string }).role === "admin" &&
    (session.user as { role?: string; activeTenantId?: string }).activeTenantId === config.tenantId;

  // El modo entrenador (banner + preguntas sin responder) solo aplica cuando el
  // dueño tiene el chatbot en modo "advanced". En "simple" no hay IA que entrenar.
  const isTrainer = isAdmin && config.chatbotMode === "advanced";

  // Modo entrenador: carga preguntas sin responder del público.
  useEffect(() => {
    if (!open || !isTrainer) {
      setPending([]);
      return;
    }
    let cancelled = false;
    fetch("/api/chat?pending=1")
      .then((r) => (r.ok ? r.json() : { questions: [] }))
      .then((d) => {
        if (!cancelled) setPending(d.questions ?? []);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, isTrainer]);

  const answerPending = async (p: { id: string; question: string }) => {
    const answer = trainingAnswer.trim();
    if (!answer) return;
    try {
      await answerPendingAction(p.id, p.question, answer);
      setPending((prev) => prev.filter((x) => x.id !== p.id));
      setTrainingId(null);
      setTrainingAnswer("");
    } catch (e) {
      console.error("[chat] error respondiendo pendiente:", e);
      setTrainingAnswer("");
      setTrainingId(null);
    }
  };

  // Cerrar al hacer click fuera del widget
  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const content = input.trim();
    if (!content || sending) return;

    const tempId = `temp-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: tempId,
      sender: "user",
      content,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setSending(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: content }),
      });
      const data = await res.json();
      if (res.ok && data.message) {
        setMessages((prev) => [...prev, data.message]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err-${Date.now()}`,
            sender: "agent",
            content: "Lo sentimos, no pudimos procesar tu mensaje. Intenta de nuevo.",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: "agent",
          content: "Ocurrió un error de conexión. Intenta de nuevo.",
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleMinimize() {
    setOpen(false);
  }

  function handleClose() {
    setMessages([]);
    setInput("");
    setOpen(false);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Cerrar chat" : "Abrir chat"}
        className={cn(
          "flex h-14 w-14 items-center justify-center text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2",
          widgetClasses,
          open ? "bg-destructive focus:ring-destructive" : "bg-primary focus:ring-primary"
        )}
      >
        {open ? <CloseIcon className="h-6 w-6" /> : <ChatIcon className="h-6 w-6" />}
      </button>

      {open && (
        <div
          ref={containerRef}
          className="fixed bottom-0 right-0 z-50 w-[calc(100vw-3rem)] max-w-sm"
        >
          <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between bg-primary px-4 py-3 text-primary-foreground">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
                  <ChatIcon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{businessName}</p>
                  <p className="text-xs text-primary-foreground/80">Asistente virtual</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleMinimize}
                  aria-label="Minimizar"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <MinimizeIcon className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  aria-label="Cerrar"
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
                >
                  <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex h-72 flex-col gap-2 overflow-y-auto p-4">
              {messages.length === 0 && (
                <div className="flex flex-col gap-2">
                  <div className="max-w-[85%] rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-sm text-foreground">
                    {isTrainer
                      ? "Modo entrenador activo: contéstale al asistente para enseñarle datos del negocio. Lo que confirmes se guarda en la base de conocimiento."
                      : `¡Hola! Soy el asistente virtual de ${businessName}. ¿En qué puedo ayudarte?`}
                  </div>

                  {isTrainer && pending.length > 0 && (
                    <div className="rounded-xl border border-primary/30 bg-primary/5 p-3">
                      <p className="px-1 pb-2 text-xs font-semibold text-foreground">
                        Tus clientes preguntaron esto
                      </p>
                      <div className="flex flex-col gap-1.5">
                        {pending.map((p) => (
                          <div
                            key={p.id}
                            className="rounded-lg border border-border bg-card px-3 py-2"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="truncate text-xs text-foreground">“{p.question}”</span>
                              <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                                {p.askedCount} {p.askedCount === 1 ? "vez" : "veces"}
                              </span>
                            </div>
                            {trainingId === p.id ? (
                              <div className="mt-2 flex flex-col gap-2">
                                <textarea
                                  value={trainingAnswer}
                                  onChange={(e) => setTrainingAnswer(e.target.value)}
                                  placeholder="Escribe la respuesta para enseñarle al asistente..."
                                  className="min-h-[60px] w-full rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setTrainingId(null);
                                      setTrainingAnswer("");
                                    }}
                                    className="rounded-lg px-2 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted"
                                  >
                                    Cancelar
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => answerPending(p)}
                                    className="rounded-lg bg-primary px-3 py-1 text-[11px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                                  >
                                    Guardar respuesta
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setTrainingId(p.id);
                                  setTrainingAnswer("");
                                }}
                                className="mt-1 text-[11px] font-medium text-primary hover:underline"
                              >
                                Responder
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                      <p className="px-1 pt-2 text-[10px] text-muted-foreground">
                        Responde para enseñarle al asistente y la pregunta dejará de aparecer.
                      </p>
                    </div>
                  )}

                  <div className="mt-1 flex flex-wrap gap-2">
					{(config.chatbotTags && config.chatbotTags.length
						? config.chatbotTags.map((t) => t.tag)
						: DEFAULT_SIMPLE_CHATBOT_TAGS
					).map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => setInput(q)}
                        className="cursor-pointer rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={cn(
                    "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                    m.sender === "user"
                      ? "self-end rounded-br-md bg-primary text-primary-foreground"
                      : "self-start rounded-bl-md bg-muted text-foreground"
                  )}
                >
                  <div className="flex flex-col gap-1 whitespace-pre-wrap">
                    {m.content.split("\n").map((line, i) => (
                      <span key={i}>
                        {line.split(/(\*\*.*?\*\*)/g).map((part, j) => 
                          part.startsWith("**") && part.endsWith("**") && part.length >= 4 
                            ? <strong key={j}>{part.slice(2, -2)}</strong> 
                            : part
                        )}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
              {sending && (
                <div className="self-start rounded-2xl rounded-bl-md bg-muted px-3 py-2 text-sm text-muted-foreground">
                  Escribiendo...
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                void sendMessage();
              }}
              className="flex items-center gap-2 border-t border-border p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe un mensaje..."
                className="h-10 flex-1 rounded-full border border-input bg-card px-4 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                className="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity disabled:opacity-50"
                aria-label="Enviar mensaje"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
                  <path d="m22 2-7 20-4-9-9-4Z" />
                  <path d="M22 2 11 13" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * Componente principal de widgets flotantes. Consulta la config white-label
 * por slug y renderiza el botón de WhatsApp y/o el chatbot según la config.
 * La forma de los widgets se resuelve dinámicamente desde TenantThemeConfig.
 * Apilados verticalmente: WhatsApp arriba, chatbot abajo.
 */
export function FloatingWidgets({ slug }: { slug?: string }) {
  const { config, loading } = useWhiteLabelConfig({ slug });
  const { config: themeConfig } = useTenantTheme(slug);
  const widgetClasses = resolveWidgetClasses(themeConfig);
  const [footerOffset, setFooterOffset] = useState(0);

  // Empuja los botones para que queden pegados por encima del footer cuando
  // este entra al viewport. Sin transición: el botón se mueve en sincronía con
  // el scroll, sin rebotes.
  useEffect(() => {
    let raf = 0;
    const update = () => {
      const footer = document.querySelector("footer");
      const vh = window.innerHeight;
      if (!footer) {
        setFooterOffset(24);
        return;
      }
      const over = vh - footer.getBoundingClientRect().top;
      setFooterOffset(over > 0 ? over + 24 : 24);
    };
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  if (loading || !config) return null;

  const showWhatsapp = config.showWhatsapp !== false;
  const showChatbot = config.showChatbot !== false;

  if (!showWhatsapp && !showChatbot) return null;

  return (
    <div className="fixed right-6 z-50 flex flex-col-reverse gap-3" style={{ bottom: footerOffset }}>
      {showChatbot && <ChatbotWidget config={config} widgetClasses={widgetClasses} />}
      {showWhatsapp && <WhatsAppButton config={config} widgetClasses={widgetClasses} />}
      <DashboardButton widgetClasses={widgetClasses} />
    </div>
  );
}

