import Image from "next/image";
import Link from "next/link";
import { Accordion, AccordionItem } from "../components/Accordion";
import { CheckCircleIcon, MapPinIcon, PhoneIcon, EnvelopeIcon, CurrencyEuroIcon, BoltIcon, TruckIcon, CogIcon, ClipboardDocumentCheckIcon, ArrowPathIcon, ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import { AppointmentFormClient } from "../components/AppointmentFormClient";

export default function Home() {
  return (
    <div className="min-h-screen text-dark-brown">
      {/* Hero Section */}
      <section className="rustic-hero text-cream py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="hero-panel max-w-3xl mx-auto text-center space-y-6 animate-fade-in">
            <p className="uppercase tracking-[0.45em] text-xs md:text-sm text-cream/70">
              Roller Werkstatt Frankfurt am Main
            </p>
            <h1 className="text-4xl md:text-6xl font-semibold leading-tight">McRoller</h1>
            <p className="text-lg md:text-xl text-cream/80">
              Ehrliche Handwerkskunst für deinen Roller – Inspektion, Reparatur und mobile Hilfe mit Herz und
              Erfahrung.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link
                href="#anfrage"
                className="inline-flex items-center gap-2 rounded-full bg-mustard px-6 py-3 text-cream font-medium shadow-lg shadow-slate-900/30 transition hover:bg-mustard/80"
              >
                Termin anfragen
              </Link>
              <Link
                href="https://wa.me/message/VY5NXLLU2HDEC1"
                className="inline-flex items-center gap-2 rounded-full border border-cream/60 px-6 py-3 font-medium text-cream transition hover:bg-cream/10"
              >
                01577&nbsp;–&nbsp;6898240
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 right-6 md:right-16 opacity-70 md:opacity-90 animate-slide-in">
          <Image
            src="/vespa-1-svgrepo-com.svg"
            alt="Vespa Illustration"
            width={180}
            height={126}
            className="w-36 h-24 md:w-48 md:h-32 drop-shadow-[0_25px_45px_rgba(0,0,0,0.25)]"
            priority
          />
        </div>
      </section>

      {/* Information Overview */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto mb-12 max-w-3xl text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-olive-700">Was du über McRoller wissen solltest</h2>
            <p className="text-base md:text-lg text-dark-brown/80">
              Alle wichtigen Infos auf einen Blick – klapp einfach die Themen auf, die dich interessieren.
            </p>
          </div>
          <Accordion>
            <AccordionItem
              title="Unsere Werkstatt-Werte"
              summary="Ehrliche Beratung, kurze Wege und viel Handschlagqualität – dafür stehen wir."
              defaultOpen
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="rustic-card p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <CurrencyEuroIcon className="h-12 w-12 text-mustard-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-olive-700">Fair &amp; transparent</h3>
                  <p className="mt-3 text-dark-brown/80">
                    Klare Vereinbarungen und ehrliche Beratung – ohne versteckte Kosten und mit viel Herzblut für dein
                    Zweirad.
                  </p>
                </div>
                <div className="rustic-card p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <BoltIcon className="h-12 w-12 text-mustard-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-olive-700">Zügig wieder mobil</h3>
                  <p className="mt-3 text-dark-brown/80">
                    Durchdachte Abläufe und mobile Einsätze verkürzen deine Standzeiten – wir halten dich in Bewegung.
                  </p>
                </div>
                <div className="rustic-card p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <TruckIcon className="h-12 w-12 text-mustard-400" />
                  </div>
                  <h3 className="text-2xl font-semibold text-olive-700">Vor Ort bei dir</h3>
                  <p className="mt-3 text-dark-brown/80">
                    Abholung, Rücklieferung oder Reparatur vor deiner Haustür – zuverlässig in ganz Frankfurt und Umgebung.
                  </p>
                </div>
              </div>
            </AccordionItem>
            <AccordionItem
              title="Leistungen im Überblick"
              summary="Vom Schnellservice bis zum Komplettaufbau – wähle genau das, was dein Roller braucht."
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Diagnose & Festpreis-Angebot",
                    icon: <ClipboardDocumentCheckIcon className="h-8 w-8 text-mustard-500" />,
                    description:
                      "Ehrliche Analyse und verbindliches Angebot direkt vor Ort – du behältst die volle Kontrolle.",
                  },
                  {
                    title: "Abholung & Rücklieferung",
                    icon: <TruckIcon className="h-8 w-8 text-mustard-500" />,
                    description:
                      "Wir holen deinen Roller ab oder reparieren direkt bei dir – in ganz Frankfurt und Umgebung.",
                  },
                  {
                    title: "Mobiler Vor-Ort-Service",
                    icon: <BoltIcon className="h-8 w-8 text-mustard-500" />,
                    description:
                      "Schnelle Hilfe am Arbeitsplatz, zuhause oder unterwegs – damit du flexibel bleibst.",
                  },
                  {
                    title: "Inspektion & Wartung",
                    icon: <CogIcon className="h-8 w-8 text-mustard-500" />,
                    description:
                      "Inspektionsservice, Ersatzteile, Fehlerdiagnose, TÜV-Vorbereitung und Tuning aus einer Hand.",
                  },
                  {
                    title: "Alle Hubraumklassen",
                    icon: <ArrowPathIcon className="h-8 w-8 text-mustard-500" />,
                    description:
                      "25ccm, 50ccm, 125ccm und E-Roller – inklusive Software-Updates und Leistungssteigerung.",
                  },
                  {
                    title: "Beratung per WhatsApp & Telefon",
                    icon: <ChatBubbleLeftRightIcon className="h-8 w-8 text-mustard-500" />,
                    description:
                      "Schick uns Bilder oder Fragen – wir klären alles persönlich und finden deinen idealen Termin.",
                  },
                ].map((item) => (
                  <div key={item.title} className="rustic-card p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="rounded-full bg-olive/15 p-3">{item.icon}</div>
                      <h3 className="text-lg font-semibold text-olive-700">{item.title}</h3>
                    </div>
                    <p className="text-sm leading-relaxed text-dark-brown/80">{item.description}</p>
                  </div>
                ))}
              </div>
            </AccordionItem>
            <AccordionItem
              title="Warum McRoller?"
              summary="Wir kombinieren Leidenschaft, Erfahrung und Nähe – für verlässliche Rollerbetreuung."
            >
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="rustic-card p-8">
                  <h3 className="text-2xl font-semibold text-olive-700">Langjährige Erfahrung</h3>
                  <p className="mt-3 leading-relaxed text-dark-brown/80">
                    Jahrzehntelange Roller-Erfahrung, sorgfältige Handarbeit und persönliche Ansprechpartner – wir kennen
                    typische Schwachstellen und finden für jedes Modell die passende Lösung.
                  </p>
                </div>
                <div className="rustic-card p-8">
                  <h3 className="text-2xl font-semibold text-olive-700">Lokal &amp; ansprechbar</h3>
                  <p className="mt-3 leading-relaxed text-dark-brown/80">
                    Wir sind in ganz Frankfurt am Main für dich da – von Höchst bis Bornheim. Direkte Kommunikation, kurze
                    Wege und feste Ansprechpartner gehören für uns dazu.
                  </p>
                </div>
              </div>
            </AccordionItem>
            <AccordionItem
              title="Roller-Marken & Einsatzgebiet"
              summary="Ob Vespa-Klassiker oder China-Roller – wir kümmern uns um alles inklusive Ersatzteilbeschaffung."
            >
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-semibold text-olive-700">Bekannte Marken</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                    {["Piaggio", "Vespa", "Peugeot", "Aprilia", "MBK", "Yamaha", "Honda", "Suzuki", "Kymco", "SYM", "Derbi", "Generic", "TGB"].map((brand) => (
                      <div
                        key={brand}
                        className="rounded-lg border border-olive/20 bg-cream/40 px-3 py-4 text-center text-dark-brown/80 transition hover:border-mustard/50 hover:bg-cream/70"
                      >
                        <p className="font-medium">{brand}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-olive-700">China-Roller &amp; günstige Marken</h3>
                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-6">
                    {["Baotian", "Rex", "Jonway", "Znen", "Yiying", "Longjia", "Motowell", "Keeway", "Benzhou", "TaoTao", "Explorer", "CPI", "Fosti", "Yamasaki", "Herkules", "Jiajue", "Jinlun"].map((brand) => (
                      <div
                        key={brand}
                        className="rounded-lg border border-olive/20 bg-cream/40 px-3 py-4 text-center text-dark-brown/80 transition hover:border-mustard/50 hover:bg-cream/70"
                      >
                        <p className="font-medium">{brand}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p className="text-lg text-dark-brown/85">
                  Auch Roller von Baotian, Jinlun, Yiying oder Explorer sind bei uns willkommen – wir kennen uns mit allen
                  Ersatzteilen und Besonderheiten dieser Marken aus.
                </p>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Appointment Section */}
      <section id="anfrage" className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-semibold text-olive-700">Jetzt Termin anfragen</h2>
              <p className="text-lg text-dark-brown/85 leading-relaxed">
                Ob Inspektion, Ölwechsel oder eine schnelle Reparatur – wähle die gewünschte Leistung, gib deinen
                Wunschtermin an und wir melden uns mit einer Bestätigung.
              </p>
              <ul className="space-y-3 text-dark-brown/85">
                {[
                  "Verbindliche Rückmeldung innerhalb von 24 Stunden",
                  "Flexible Termine in Frankfurt & Umgebung",
                  "Transparente Preise ohne Überraschungen"
                ].map((benefit) => (
                  <li key={benefit} className="flex items-start gap-3">
                    <CheckCircleIcon className="w-6 h-6 text-mustard-500 flex-shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
              <div className="rustic-card p-6 text-dark-brown/80 text-sm leading-relaxed">
                <p>
                  <strong className="text-olive-700">Tipp:</strong> Je genauer deine Angaben, desto schneller können wir
                  Ersatzteile reservieren und dich einplanen.
                </p>
              </div>
            </div>
            <AppointmentFormClient />
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="bg-cream/30 py-24">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-semibold text-olive-700">Kontakt aufnehmen</h2>
            <p className="text-base md:text-lg text-dark-brown/80">
              Du hast eine Frage oder möchtest direkt einen Rückruf? Öffne die passende Kachel und leg los.
            </p>
          </div>
          <Accordion className="mx-auto mt-12 max-w-5xl">
            <AccordionItem
              title="Adresse & Kontaktwege"
              summary="Per Telefon, WhatsApp oder E-Mail – wir antworten werktags innerhalb von 24 Stunden."
              defaultOpen
            >
              <div className="grid gap-6 lg:grid-cols-2">
                <div className="rustic-card p-8">
                  <h3 className="text-2xl font-semibold text-olive-700">Adresse</h3>
                  <p className="mt-4 text-lg leading-relaxed text-dark-brown/85">
                    <MapPinIcon className="mr-2 inline h-5 w-5 text-mustard-500" />Mörfelder Landstraße 12-18
                    <br />60599 Frankfurt am Main
                    <br />Deutschland
                  </p>
                </div>
                <div className="rustic-card p-8">
                  <h3 className="text-2xl font-semibold text-olive-700">Kontakt</h3>
                  <ul className="mt-4 space-y-3 text-lg leading-relaxed text-dark-brown/85">
                    <li>
                      <PhoneIcon className="mr-2 inline h-5 w-5 text-mustard-500" />Telefon:
                      <a href="tel:01577-6898240" className="ml-2 underline decoration-mustard/60 hover:text-mustard-500">
                        01577-6898240
                      </a>
                    </li>
                    <li>
                      <EnvelopeIcon className="mr-2 inline h-5 w-5 text-mustard-500" />E-Mail:
                      <a
                        href="mailto:McRollerffm@gmail.com"
                        className="ml-2 underline decoration-mustard/60 hover:text-mustard-500"
                      >
                        McRollerffm@gmail.com
                      </a>
                    </li>
                    <li>
                      <ChatBubbleLeftRightIcon className="mr-2 inline h-5 w-5 text-mustard-500" />WhatsApp:
                      <a
                        href="https://wa.me/message/VY5NXLLU2HDEC1"
                        className="ml-2 underline decoration-mustard/60 hover:text-mustard-500"
                      >
                        wa.me
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </AccordionItem>
            <AccordionItem
              title="Werkstattzeiten & Standort"
              summary="Flexible Terminfenster nach Absprache – wir richten uns nach deinem Alltag."
            >
              <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr),420px]">
                <div className="rustic-card p-6">
                  <h3 className="text-xl font-semibold text-olive-700">Werkstattzeiten</h3>
                  <p className="mt-3 text-sm leading-relaxed text-dark-brown/80">
                    Termine nach Absprache – wir holen deinen Roller bei Bedarf ab und bringen ihn nach der Reparatur
                    wieder zurück.
                  </p>
                </div>
                <div className="rustic-card p-6 lg:p-8">
                  <h3 className="text-2xl font-semibold text-olive-700">Unser Standort</h3>
                  <div className="mt-4 h-64 w-full overflow-hidden rounded-2xl rustic-border">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2561.518!2d8.675789!3d50.123456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47bd096f8b8b8b8b%3A0x8b8b8b8b8b8b8b8b!2sM%C3%B6rfelder%20Landstra%C3%9Fe%2012-18%2C%2060599%20Frankfurt%20am%20Main%2C%20Deutschland!5e0!3m2!1sen!2sde!4v1693526400!5m2!1sen!2sde"
                      width="100%"
                      height="100%"
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="McRoller Standort"
                      className="h-full w-full border-0"
                    ></iframe>
                  </div>
                </div>
              </div>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-brown text-cream py-10">
        <div className="container mx-auto px-4 text-center space-y-3">
          <p className="uppercase tracking-[0.3em] text-xs text-cream/70">McRoller Werkstatt</p>
          <p className="text-sm md:text-base">&copy; 2025 McRoller. Handwerk aus Frankfurt am Main.</p>
          <p>
            <Link href="/impressum" className="text-cream/80 hover:text-mustard-300 underline">
              Impressum
            </Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
