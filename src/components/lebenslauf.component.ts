import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// FIX: Corrected the import path for PdfService, which was causing the service to be typed as 'unknown'.
import { PdfService } from '../services/pdf.service';

interface Experience {
  role: string;
  company: string;
  period: string;
  description: string[];
  tech: string[];
  subtitle?: string;
}

interface Education {
  degree: string;

  institution: string;
  period: string;
  location?: string;
  details?: string[];
}

interface SkillItem {
  name: string;
  level: number;
}

interface SkillCategory {
  category: string;
  items: SkillItem[];
}

@Component({
  selector: 'app-lebenslauf',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lebenslauf.component.html',
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.5s ease-out forwards;
    }
    @keyframes fadeIn {
      from { 
        opacity: 0;
        transform: translateY(-10px);
      }
      to { 
        opacity: 1;
        transform: translateY(0);
      }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LebenslaufComponent {
  private pdfService = inject(PdfService);

  name = signal('David Castillo');
  title = signal('Softwareentwickler');
  profilePicture = signal('https://i.postimg.cc/TYXmJXvb/davidcastillo.png');

  contact = signal({
    phone: '+49 (0) 15752832965',
    email: 'davidcast@gmx.de',
    github: 'https://github.com/Davidcastmed',
    address: 'Kirchenstraße 12, 25364 Brande-Hörnerkirchen'
  });

  personalInfo = signal({
    dateOfBirth: '19.03.1987',
    nationality: 'Nicaraguanisch'
  });
  
  about = signal('Vielseitiger Softwareentwickler und Datenanalyst mit umfangreicher Erfahrung in der Entwicklung moderner Webanwendungen und der Analyse komplexer Datensätze. Nachgewiesene Fähigkeit, technische Lösungen mit Angular, Node.js und SQL-Datenbanken zu liefern. Engagiert, teamorientiert und bestrebt, durchdachten und effizienten Code zu erstellen, um innovative Projekte voranzutreiben. Aktuell erweitere ich meine Fähigkeiten durch einen Kurs in App-Design & Motion Design, das voraussichtlich im April 2026 abgeschlossen wird.');
  
  experiences = signal<Experience[]>([
    {
      role: 'Lead Entwickler & UI/UX Designer (Projekt)',
      company: 'BETREUUNGSVERLAUF (PhiConsulting)',
      subtitle: 'Eine Webanwendung zur Digitalisierung von Betreuungsprozessen in Pflegeeinrichtungen.',
      period: '2025 - 2026',
      description: [
        'Eigenverantwortliche Konzeption und Entwicklung einer SPA zur Digitalisierung und Verwaltung von Betreuungsabläufen.',
        'Umsetzung eines interaktiven Dashboards zur Echtzeit-Überwachung medizinischer Daten und zur Dokumentation des Betreuungsfortschritts.'
      ],
      tech: ['Angular', 'TypeScript', 'Figma', 'UI/UX Design', 'SCSS']
    },
    {
      role: 'Lead Entwickler & Architekt (Projekt)',
      company: 'INVEX – Clientseitiges ERP-System für den Einzelhandel',
      period: '2025 - 2026',
      description: [
        'Konzeption und Entwicklung einer umfassenden Single-Page-Anwendung (SPA) mit Angular zur Verwaltung von kleinen bis mittelständischen Einzelhandelsunternehmen (z.B. Eisenwarengeschäfte).',
        'Die Anwendung ist vollständig clientseitig und offline-fähig durch den Einsatz von IndexedDB als lokale Datenbank.'
      ],
      tech: ['Angular', 'TypeScript', 'SPA', 'IndexedDB', 'Offline-First']
    },
    {
      role: 'UI/UX Designer & Projektkonzeption (Projekt)',
      company: 'Marktanalyse-App',
      period: '2025 - 2026',
      description: [
        'Konzeption einer App zur Marktanalyse durch die Analyse von Verkaufsdaten und Produktaktionen, um den globalen Verkaufsfluss zu steigern.',
        'Dieses Projekt umfasste ausschließlich die UI/UX-Gestaltung und das Projektdesign.'
      ],
      tech: ['UI/UX Design', 'InDesign', 'Projektkonzeption']
    },
    {
      role: 'Data Scientist/Softwareentwickler',
      company: 'Rösler IT-Solutions GmbH',
      period: 'Jan. 2023 - Dez. 2024',
      description: [
        'Durchführung von Datenbanknormalisierung und -management mit SSMS und SQL-Server.',
        'Entwicklung und Wartung von Webanwendungen mit Angular, Express.js und Node.js.'
      ],
      tech: ['Datenbanknormalisierung', 'SSMS', 'SQL-Server', 'Angular', 'Express.js', 'Node.js']
    },
    {
      role: 'Full-Stack Entwickler (Projekt)',
      company: 'Phi-Commerce Online-Shop',
      period: 'Jul. 2022 - Dez. 2022',
      description: [
        'Eigenständige Entwicklung eines vollständigen Online-Shop.'
      ],
      tech: ['Angular', 'Node.js', 'Express.js', 'SQL-Server']
    },
    {
      role: 'Betreuungshelfer',
      company: 'Vogthof Ammersbek',
      period: 'Apr. 2020 - Dez. 2021',
      description: [
        'Unterstützung und Betreuung von Bewohnern in einer sozialen Einrichtung.'
      ],
      tech: []
    },
    {
      role: 'Frontend Developer & Datenanalyst',
      company: 'Tri Source International',
      period: 'Okt. 2016 - Feb. 2019',
      description: [
        'Entwicklung von Frontend-Schnittstellen und Komponenten mit Angular.',
        'Datenanalyse, -bereinigung und -visualisierung mittels SQL und Tableau.',
        'Mitarbeit an der Entwicklung von APIs mit Golang und Durchführung von Qualitätssicherungsmaßnahmen (QA).'
      ],
      tech: ['Angular', 'SQL', 'Tableau', 'Golang API', 'QA', 'HTML/CSS', 'jQuery']
    },
    {
      role: 'Freiwilligendienst',
      company: 'Raleigh International / Freunde der Erziehungskunst',
      period: 'Mai 2014 - Mär. 2016',
      description: [
        'Teilnahme an internationalen Freiwilligenprojekten zur Förderung von Gemeinschaft und Bildung.'
      ],
      tech: []
    },
    {
      role: 'Webdesign, Fotografie, Grafik',
      company: 'FUNARTE Nicaragua',
      period: '2011 - 2013',
      description: [
        'Gestaltung und Umsetzung von Webdesigns, gepaart mit Fotografie- und Grafikprojekten für eine Kunststiftung.'
      ],
      tech: ['Webdesign', 'Fotografie', 'Grafikdesign']
    }
  ]);

  education = signal<Education[]>([
    {
      degree: 'App-Design & Motion Design',
      institution: 'Wildner Akademie',
      period: 'Seit 2025 - voraussichtlich Apr. 2026'
    },
    {
      degree: 'SQL und Datenbankdesign',
      institution: 'Symplasson',
      period: '2023'
    },
    {
      degree: 'Website-Design und Programmierung',
      institution: 'Wildner Akademie',
      period: '05.2022 – 11.2022'
    },
    {
      degree: 'Deutsch C1',
      institution: 'Inlingua Hamburg',
      period: '2020 – 2021'
    },
    {
      degree: 'Informatik (B.Sc., Note 2,0)',
      institution: 'UNAN',
      period: '2004 – 2010',
      location: 'Nicaragua',
      details: ['Bachelorarbeit: Personenstandsregistersystem (Note: 1,2)']
    },
    {
      degree: 'Abitur (Note: 2,0)',
      institution: 'IPARSE',
      period: '1998 – 2003',
      location: 'Nicaragua'
    }
  ]);

  skills = signal<SkillCategory[]>([
    { 
      category: 'Frameworks & Bibliotheken', 
      items: [
        { name: 'Angular', level: 98 },
        { name: 'Node.js', level: 95 },
        { name: 'Express.js', level: 93 },
        { name: 'RxJS', level: 90 },
        { name: 'NgRx', level: 88 },
        { name: 'D3.js', level: 85 },
        { name: 'React', level: 70 },
        { name: 'Vue.js', level: 70 }
      ] 
    },
    { 
      category: 'Datenbanken', 
      items: [
        { name: 'NoSQL', level: 90 },
        { name: 'MongoDB', level: 80 },
        { name: 'MySQL', level: 95 },
        { name: 'PostgreSQL', level: 92 },
        { name: 'SQL-Server', level: 96 }
      ] 
    },
    { 
      category: 'Werkzeuge & Technologien', 
      items: [
        { name: 'Git', level: 98 },
        { name: 'Docker', level: 85 },
        { name: 'Jira', level: 90 },
        { name: 'npm', level: 95 },
        { name: 'yarn', level: 95 },
        { name: 'HTML', level: 98 },
        { name: 'CSS', level: 98 },
        { name: 'SCSS', level: 95 },
        { name: 'Tableau', level: 90 },
        { name: 'Windows Server', level: 85 },
        { name: 'ETL-Prozesse', level: 90 },
        { name: 'Adobe Photoshop', level: 95 },
        { name: 'Adobe InDesign', level: 90 },
        { name: 'Figma', level: 92 },
        { name: 'Adobe After Effects', level: 85 },
        { name: 'Premiere Pro', level: 85 },
        { name: 'Cinema 4D', level: 65 }
      ] 
    },
    { 
      category: 'KI & Cloud', 
      items: [
        { name: 'Firebase', level: 90 },
        { name: 'KI (allgemein)', level: 90 },
        { name: 'Google AI Studio', level: 90 },
        { name: 'Google Cloud', level: 90 }
      ] 
    }
  ]);

  languages = signal([
    { lang: 'Spanisch', level: 'Muttersprache' },
    { lang: 'Deutsch', level: 'Fließend' },
    { lang: 'Englisch', level: 'Fließend' }
  ]);

  hobbies = signal<string[]>(['Kunst', 'Musik', 'Gitarre', 'Joggen', 'Fahrradfahren', 'Kino', 'Fotografie', 'Grafikdesign', 'Zeichnen', 'Bailar Salsa', 'Bachata', 'Techno']);

  isSidebarVisible = signal(false);
  isPdfButtonVisible = signal(false);
  isLoadingPdf = signal(false);

  toggleSidebar(): void {
    this.isSidebarVisible.update(v => !v);
  }

  togglePdfButtonVisibility(): void {
    this.isPdfButtonVisible.update(v => !v);
  }

  async downloadAsPdf(cvContainer: HTMLElement): Promise<void> {
    const originalSidebarState = this.isSidebarVisible();
    
    this.isLoadingPdf.set(true);
    // Remove the border class before capturing for a cleaner PDF look
    cvContainer.classList.remove('main-container-border');

    // To get the best PDF layout, we use the full-width view.
    if (originalSidebarState) {
        this.isSidebarVisible.set(false);
        // Wait a moment for the DOM to update before capturing.
        await new Promise(resolve => setTimeout(resolve, 50));
    }

    try {
        await this.pdfService.generatePdfFromElement(cvContainer, 'Lebenslauf-David-Castillo');
    } catch (error) {
        console.error('Failed to generate PDF', error);
        // Optionally, show an error message to the user
    } finally {
        // Restore the UI to its original state
        cvContainer.classList.add('main-container-border');
        if (originalSidebarState) {
            this.isSidebarVisible.set(true);
        }
        this.isLoadingPdf.set(false);
    }
  }
}