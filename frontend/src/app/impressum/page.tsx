import Link from "next/link";

export default function Impressum() {
  return (
    <div className="min-h-screen text-dark-brown py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-semibold mb-8 text-center text-olive-900">Impressum</h1>

        <div className="rustic-section p-8">
          <h2 className="text-2xl font-semibold mb-4 text-olive-900">Angaben gemäß § 5 TMG</h2>
          <p className="text-dark-brown mb-4">
            McRoller<br />
            Roller Werkstatt<br />
            Mörfelder Landstraße 12-18<br />
            60599 Frankfurt am Main<br />
            Deutschland<br />
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-olive-900">Kontakt</h2>
          <p className="text-dark-brown mb-4">
            Telefon: [Telefonnummer]<br />
            E-Mail: info@mcroller.de
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-olive-900">Vertreten durch</h2>
          <p className="text-dark-brown mb-4">
            [Vorname Nachname]<br />
            Geschäftsführer
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-olive-900">Registereintrag</h2>
          <p className="text-dark-brown mb-4">
            Eintragung im Handelsregister.<br />
            Registergericht: [Registergericht]<br />
            Registernummer: [Registernummer]
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-olive-900">Umsatzsteuer-ID</h2>
          <p className="text-dark-brown mb-4">
            Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
            [USt-ID]
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-olive-900">Haftung für Inhalte</h2>
          <p className="text-dark-brown mb-4">
            Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-olive-900">Haftung für Links</h2>
          <p className="text-dark-brown mb-4">
            Verweise und Links auf Webseiten Dritter liegen außerhalb unseres Verantwortungsbereichs. Es wird jegliche Verantwortung für solche Webseiten abgelehnt. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich.
          </p>

          <h2 className="text-2xl font-semibold mb-4 text-olive-900">Urheberrecht</h2>
          <p className="text-dark-brown mb-4">
            Die durch die Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Die Vervielfältigung, Bearbeitung, Verbreitung und jede Art der Verwertung außerhalb der Grenzen des Urheberrechtes bedürfen der schriftlichen Zustimmung des jeweiligen Autors bzw. Erstellers.
          </p>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="text-dark-brown/80 hover:text-mustard-600 underline decoration-mustard/40">
            Zurück zur Startseite
          </Link>
        </div>
      </div>
    </div>
  );
}
