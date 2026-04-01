"use client";

import { useState } from "react";

interface Props {
  listingId: string;
  listingTitle: string;
}

export default function ContactForm({ listingId, listingTitle }: Props) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, ...form }),
      });
      const json = (await res.json()) as { success?: boolean; error?: string };
      if (!res.ok || !json.success) {
        setErrorMsg(json.error ?? "Błąd wysyłania. Spróbuj ponownie.");
        setStatus("error");
      } else {
        setStatus("success");
      }
    } catch {
      setErrorMsg("Błąd sieci. Sprawdź połączenie i spróbuj ponownie.");
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
        <p className="text-3xl mb-3">✅</p>
        <p className="text-lg font-bold text-green-800">Zapytanie wysłane!</p>
        <p className="text-sm text-green-700 mt-1">
          Skontaktujemy się z <strong>{listingTitle}</strong> w Twoim imieniu.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6">
      <h2 className="text-xl font-bold mb-1">Zapytaj o dostępność</h2>
      <p className="text-sm text-[var(--color-muted)] mb-4">
        Wyślij zapytanie do <strong>{listingTitle}</strong>. Odpowiemy jak najszybciej.
      </p>

      <form onSubmit={(e) => { void handleSubmit(e); }} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-name" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
              Imię i nazwisko *
            </label>
            <input
              id="contact-name"
              type="text"
              required
              minLength={2}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="Jan Kowalski"
            />
          </div>
          <div>
            <label htmlFor="contact-email" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
              E-mail *
            </label>
            <input
              id="contact-email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
              className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
              placeholder="jan@example.com"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-phone" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
            Telefon (opcjonalnie)
          </label>
          <input
            id="contact-phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="+48 500 000 000"
          />
        </div>
        <div>
          <label htmlFor="contact-message" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
            Wiadomość *
          </label>
          <textarea
            id="contact-message"
            required
            minLength={10}
            rows={4}
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
            placeholder="Dzień dobry, chciałbym zapytać o dostępność…"
          />
        </div>

        {status === "error" && (
          <p className="text-sm text-red-600 font-semibold">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={status === "sending"}
          className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[var(--color-primary)] text-white font-semibold text-sm hover:bg-[var(--color-primary-hover)] transition-colors disabled:opacity-60 shadow-[0_10px_25px_rgba(227,6,19,0.18)]"
        >
          {status === "sending" ? "Wysyłanie…" : "Wyślij zapytanie"}
        </button>
      </form>
    </div>
  );
}
