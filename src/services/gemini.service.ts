import { Injectable } from '@angular/core';
import { GoogleGenAI } from "@google/genai";

declare var process: any;

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private readonly ai: GoogleGenAI;
  private readonly cvText = `
  David Castillo - Softwareentwickler

  Persönliche Daten:
  - Adresse: Kirchenstraße 12, 25364 Brande-Hörnerkirchen
  - Geboren: 19.03.1987
  - Nationalität: Nicaraguanisch

  Kontakt:
  - Telefon: +49 (0) 15752832965
  - Email: davidcast@gmx.de
  - Github: https://github.com/Davidcastmed

  Über mich:
  Vielseitiger Softwareentwickler und Datenanalyst mit umfangreicher Erfahrung in der Entwicklung moderner Webanwendungen und der Analyse komplexer Datensätze. Nachgewiesene Fähigkeit, technische Lösungen mit Angular, Node.js und SQL-Datenbanken zu liefern. Engagiert, teamorientiert und bestrebt, durchdachten und effizienten Code zu erstellen, um innovative Projekte voranzutreiben. Aktuell erweitere ich meine Fähigkeiten durch einen Kurs in App-Design & Motion Design, das voraussichtlich im April 2026 abgeschlossen wird.

  Berufserfahrung:
  - Lead Entwickler & UI/UX Designer für Projekt "BETREUUNGSVERLAUF" (PhiConsulting) (2025 - 2026)
    - Beschreibung: Eine Webanwendung zur Digitalisierung von Betreuungsprozessen in Pflegeeinrichtungen.
    - Aufgaben: Eigenverantwortliche Konzeption und Entwicklung einer SPA zur Digitalisierung von Betreuungsabläufen, Umsetzung eines interaktiven Dashboards zur Echtzeit-Überwachung medizinischer Daten. (Technologien: Angular, TypeScript, Figma, UI/UX Design, SCSS)

  - Lead Entwickler & Architekt (Projekt): INVEX – Clientseitiges ERP-System für den Einzelhandel (2025 - 2026)
    - Aufgaben: Konzeption und Entwicklung einer umfassenden Single-Page-Anwendung (SPA) mit Angular zur Verwaltung von kleinen bis mittelständischen Einzelhandelsunternehmen (z.B. Eisenwarengeschäfte). Die Anwendung ist vollständig clientseitig und offline-fähig durch den Einsatz von IndexedDB als lokale Datenbank. (Technologien: Angular, TypeScript, SPA, IndexedDB, Offline-First)

  - UI/UX Designer & Projektkonzeption (Projekt): Marktanalyse-App (2025 - 2026)
    - Aufgaben: Konzeption einer App zur Marktanalyse durch die Analyse von Verkaufsdaten und Produktaktionen, um den globalen Verkaufsfluss zu steigern. Dieses Projekt umfasste ausschließlich die UI/UX-Gestaltung und das Projektdesign. (Technologien: UI/UX Design, InDesign, Projektkonzeption)

  - Data Scientist/Softwareentwickler bei Rösler IT-Solutions GmbH (Jan. 2023 - Dez. 2024)
    - Aufgaben: Datenbanknormalisierung, SSMS, SQL-Server, Angular, Express.js, Node.js.

  - Full-Stack Entwickler für Projekt "Phi-Commerce" Online-Shop (Jul. 2022 - Dez. 2022)
    - Aufgaben: Entwicklung eines Online-Shops mit Angular, Node.js, Express.js, SQL-Server.

  - Betreuungshelfer bei Vogthof Ammersbek (Apr. 2020 - Dez. 2021)
    - Soziale Tätigkeit im Betreuungsbereich.

  - Frontend Developer & Datenanalyst bei Tri Source International (Okt. 2016 - Feb. 2019)
    - Aufgaben: Frontend-Entwicklung mit Angular, Datenanalyse mit SQL und Tableau, API-Entwicklung mit Golang, QA, HTML/CSS/jQuery.

  - Freiwilligendienst bei Raleigh International / Freunde der Erziehungskunst (Mai 2014 - Mär. 2016)
    - Teilnahme an internationalen Freiwilligenprojekten.

  - Webdesign, Fotografie, Grafik bei FUNARTE Nicaragua (2011 - 2013)
    - Kreative Gestaltung von Web- und Grafikprojekten.

  Bildungsweg:
  - App-Design & Motion Design (Wildner Akademie, Seit 2025 - voraussichtlich Apr. 2026)
  - SQL und Datenbankdesign (Symplasson, 2023)
  - Website-Design und Programmierung (Wildner Akademie, 05.2022 – 11.2022)
  - Deutsch C1 (Inlingua Hamburg, 2020 – 2021)
  - Informatik (B.Sc., Note 2,0) (UNAN, Nicaragua, 2004 – 2010)
    - Bachelorarbeit: Personenstandsregistersystem (Note: 1,2)
  - Abitur (Note: 2,0) (IPARSE, Nicaragua, 1998 – 2003)

  Kenntnisse:
  - Programmiersprachen: JavaScript, TypeScript, SQL, Java.
  - Frameworks & Bibliotheken: Angular, Node.js, Express.js, RxJS, NgRx, D3.js, React, Vue.js.
  - Datenbanken: NoSQL, MongoDB, MySQL, PostgreSQL, SQL-Server.
  - Werkzeuge & Technologien: Git, Docker, Jira, npm, yarn, HTML, CSS, SCSS, Tableau, Windows Server, ETL-Prozesse, Adobe Photoshop, Adobe InDesign, Figma, Adobe After Effects, Premiere Pro, Cinema 4D.
  - KI & Cloud: Firebase, KI (allgemein), Google AI Studio, Google Cloud.

  Sprachen:
  - Spanisch: Muttersprache
  - Deutsch: Fließend
  - Englisch: Fließend

  Hobbys:
  Kunst, Musik, Gitarre, Joggen, Fahrradfahren, Kino, Fotografie, Grafikdesign, Zeichnen, Bailar Salsa, Bachata, Techno.
  `;

  constructor() {
    if (typeof process === 'undefined' || !process.env.API_KEY) {
      console.error("API_KEY is not defined in environment variables.");
    }
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async *askAboutCvStream(question: string, history: ChatMessage[]): AsyncGenerator<string> {
    const systemInstruction = `Sie sind ein hilfreicher Assistent, der Fragen zum Lebenslauf von David Castillo beantwortet. Antworten Sie auf Deutsch. Verwenden Sie ausschließlich die Informationen aus dem folgenden Lebenslauf. Erfinden Sie keine Informationen. Halten Sie die Antworten kurz und präzise.
    ---
    LEBENSLAUF:
    ${this.cvText}
    ---
    `;

    try {
        const chat = this.ai.chats.create({
          model: 'gemini-2.5-flash',
          config: { systemInstruction },
          history: history.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.text }]
          }))
        });

        const stream = await chat.sendMessageStream({ message: question });

        for await (const chunk of stream) {
            yield chunk.text;
        }

    } catch (error) {
        console.error('Error calling Gemini API:', error);
        yield 'Es tut mir leid, es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.';
    }
  }
}