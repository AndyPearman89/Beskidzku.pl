import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dodaj firmę — Beskidzku.pl",
  description: "Dodaj swój obiekt do katalogu Beskidzku.pl. Dotrzyj do tysięcy turystów planujących wyjazd w Beskidy.",
};

export default function DodajFirmePage() {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--color-primary-soft)] text-[var(--color-primary)] px-4 py-2 text-xs font-semibold uppercase tracking-wide mb-4">
          Dla firm i obiektów
        </div>
        <h1 className="text-4xl font-extrabold">Dodaj swój obiekt</h1>
        <p className="text-[var(--color-muted)] mt-3 text-base max-w-lg mx-auto">
          Dołącz do katalogu Beskidzku.pl i dotrzyj do tysięcy turystów planujących wyjazd w Beskidy każdego tygodnia.
        </p>
      </div>

      {/* Package comparison */}
      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        {[
          {
            name: "FREE",
            price: "0 zł",
            period: "za zawsze",
            features: ["Wpis w katalogu", "Podstawowy opis", "Dane kontaktowe ukryte", "Wspólny marker na mapie", "Niska pozycja w wyszukiwaniu"],
            highlight: false,
          },
          {
            name: "PREMIUM",
            price: "99 zł",
            period: "miesięcznie",
            features: ["Pełne dane kontaktowe", "Indywidualny marker na mapie", "Wyższa pozycja", "Rozszerzony opis", "Galeria zdjęć"],
            highlight: true,
          },
          {
            name: "PREMIUM+",
            price: "249 zł",
            period: "miesięcznie",
            features: ["Najwyższa pozycja", "Wyróżniony marker", "Na stronie głównej", "Priorytet w wyszukiwaniu", "Nielimitowane zdjęcia", "Panel analityczny"],
            highlight: false,
          },
        ].map((pkg) => (
          <div
            key={pkg.name}
            className={`rounded-2xl p-5 border ${pkg.highlight ? "border-[var(--color-primary)] shadow-[0_15px_35px_rgba(227,6,19,0.12)]" : "border-[var(--color-border)]"} bg-white relative`}
          >
            {pkg.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[var(--color-primary)] text-white text-xs font-bold px-3 py-1 rounded-full">
                Polecany
              </div>
            )}
            <p className={`text-sm font-bold ${pkg.highlight ? "text-[var(--color-primary)]" : "text-[var(--color-text)]"}`}>
              {pkg.name}
            </p>
            <p className="text-3xl font-extrabold mt-1">{pkg.price}</p>
            <p className="text-xs text-[var(--color-muted)]">{pkg.period}</p>
            <ul className="mt-4 space-y-2">
              {pkg.features.map((f) => (
                <li key={f} className="text-sm text-[var(--color-muted)] flex items-center gap-2">
                  <span className={pkg.highlight ? "text-[var(--color-primary)]" : "text-gray-400"}>✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Submission form */}
      <div className="bg-white rounded-2xl border border-[var(--color-border)] shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-1">Zgłoś swój obiekt</h2>
        <p className="text-sm text-[var(--color-muted)] mb-6">
          Wypełnij formularz, a nasz zespół skontaktuje się z Tobą w ciągu 24 godzin.
        </p>

        <BusinessForm />
      </div>

      {/* Trust signals */}
      <div className="mt-8 grid sm:grid-cols-3 gap-4 text-center">
        {[
          { icon: "🏔️", label: "120+ obiektów", desc: "w katalogu Beskidzku.pl" },
          { icon: "👥", label: "Tysiące turystów", desc: "miesięcznie planuje wyjazd" },
          { icon: "📈", label: "Widoczność online", desc: "w wynikach wyszukiwania" },
        ].map((item) => (
          <div key={item.label} className="rounded-2xl bg-white border border-[var(--color-border)] p-4">
            <p className="text-3xl mb-2">{item.icon}</p>
            <p className="font-bold text-sm">{item.label}</p>
            <p className="text-xs text-[var(--color-muted)] mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// Static form using standard HTML mailto action — no client JS needed
function BusinessForm() {
  return (
    <form
      action="mailto:kontakt@beskidzku.pl"
      method="post"
      encType="text/plain"
      className="space-y-4"
    >
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="biz-name" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
            Nazwa obiektu *
          </label>
          <input
            id="biz-name"
            name="nazwa"
            type="text"
            required
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="np. Hotel Górski Widok"
          />
        </div>
        <div>
          <label htmlFor="biz-type" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
            Rodzaj obiektu *
          </label>
          <select
            id="biz-type"
            name="rodzaj"
            required
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">Wybierz…</option>
            <option value="hotel">Hotel / pensjonat</option>
            <option value="restaurant">Restauracja / kawiarnia</option>
            <option value="attraction">Atrakcja turystyczna</option>
            <option value="spa">SPA / wellness</option>
            <option value="shop">Sklep / usługi</option>
            <option value="other">Inne</option>
          </select>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="biz-town" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
            Miejscowość *
          </label>
          <select
            id="biz-town"
            name="miejscowosc"
            required
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="">Wybierz…</option>
            <option value="Szczyrk">Szczyrk</option>
            <option value="Wisła">Wisła</option>
            <option value="Ustroń">Ustroń</option>
            <option value="Żywiec">Żywiec</option>
            <option value="Bielsko-Biała">Bielsko-Biała</option>
            <option value="Sucha Beskidzka">Sucha Beskidzka</option>
            <option value="Inne">Inna miejscowość</option>
          </select>
        </div>
        <div>
          <label htmlFor="biz-package" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
            Preferowany pakiet
          </label>
          <select
            id="biz-package"
            name="pakiet"
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          >
            <option value="FREE">FREE (0 zł)</option>
            <option value="PREMIUM">PREMIUM (99 zł/mies.)</option>
            <option value="PREMIUM+">PREMIUM+ (249 zł/mies.)</option>
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="biz-contact-name" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
          Imię i nazwisko *
        </label>
        <input
          id="biz-contact-name"
          name="kontakt_imie"
          type="text"
          required
          className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          placeholder="Jan Kowalski"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="biz-email" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
            E-mail *
          </label>
          <input
            id="biz-email"
            name="email"
            type="email"
            required
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="kontakt@twojafirma.pl"
          />
        </div>
        <div>
          <label htmlFor="biz-phone" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
            Telefon
          </label>
          <input
            id="biz-phone"
            name="telefon"
            type="tel"
            className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
            placeholder="+48 500 000 000"
          />
        </div>
      </div>

      <div>
        <label htmlFor="biz-message" className="text-xs font-semibold text-[var(--color-muted)] block mb-1">
          Krótki opis obiektu
        </label>
        <textarea
          id="biz-message"
          name="opis"
          rows={3}
          className="w-full border border-[var(--color-border)] rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] resize-none"
          placeholder="Kilka zdań o Twoim obiekcie…"
        />
      </div>

      <button
        type="submit"
        className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[var(--color-primary)] text-white font-bold text-sm hover:bg-[var(--color-primary-hover)] transition-colors shadow-[0_15px_35px_rgba(227,6,19,0.2)]"
      >
        Wyślij zgłoszenie →
      </button>
      <p className="text-xs text-center text-[var(--color-muted)]">
        Skontaktujemy się w ciągu 24 godzin. Bez zobowiązań.
      </p>
    </form>
  );
}
