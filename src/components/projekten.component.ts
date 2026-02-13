import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryProject {
  id: number;
  title: string;
  category: string;
  images: string[];
  description: string;
  demoInfo?: {
    url: string;
    user: string;
    pass: string;
  }
}

@Component({
  selector: 'app-projekten',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto max-w-[1200px] p-4 md:p-8">
      <header class="text-left mb-8 md:mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800">Projekte</h1>
        <p class="mt-4 text-lg text-gray-600 max-w-2xl">Eine Auswahl meiner wichtigsten Softwareentwicklungsprojekte.</p>
      </header>
      
      <!-- Projects Pages -->
      <div class="space-y-12">
        @for (project of projects(); track project.id) {
          <section class="bg-white p-6 md:p-10 shadow-lg border border-gray-200 rounded-lg">
            <!-- Page Header -->
            <header class="mb-6 border-b pb-4">
              <h2 class="text-3xl font-bold text-gray-800">{{ project.title }}</h2>
              <p class="text-md text-blue-600 font-semibold">{{ project.category }}</p>
            </header>

            <!-- Description -->
            <p class="text-gray-700 text-lg mb-6">{{ project.description }}</p>

            <!-- Demo Info -->
            @if (project.demoInfo) {
              <div class="mt-4 mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-r-lg">
                <h4 class="font-semibold text-lg text-blue-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Live-Demo
                </h4>
                <p class="text-blue-700 mt-2">
                  Um dieses System in Aktion zu sehen und seine verschiedenen Funktionalitäten zu erkunden, können Sie eine voll funktionsfähige Online-Demo aufrufen.
                </p>
                <div class="mt-3 bg-gray-100 p-3 rounded-md">
                  <p class="text-gray-800"><span class="font-semibold">Benutzername:</span> <code class="bg-gray-200 px-2 py-1 rounded">{{ project.demoInfo.user }}</code></p>
                  <p class="text-gray-800 mt-1"><span class="font-semibold">Passwort:</span> <code class="bg-gray-200 px-2 py-1 rounded">{{ project.demoInfo.pass }}</code></p>
                </div>
                <a [href]="project.demoInfo.url" target="_blank" rel="noopener noreferrer" class="inline-flex items-center mt-3 text-blue-600 font-bold hover:underline">
                  Demo öffnen 
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            }

            <!-- Image Gallery -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (image of project.images; track image; let i = $index) {
                <div (click)="openModal(project, i)" class="group relative rounded-lg overflow-hidden cursor-pointer border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-md bg-gray-100 aspect-video">
                  <img [src]="image" [alt]="project.title + ' Bild ' + (i + 1)" class="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105">
                  <div class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                </div>
              }
            </div>
          </section>
        }
      </div>

      <!-- Fullscreen Image Modal -->
      @if (selectedProject()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
             [class.animate-fade-in]="!isClosing()"
             [class.animate-fade-out]="isClosing()"
             (click)="closeModal()">
          
          <!-- Image Container -->
          <div class="relative w-full h-full flex items-center justify-center p-4" (click)="$event.stopPropagation()">
            <img [src]="currentImageUrl()" [alt]="selectedProject()?.title" class="block object-contain w-auto h-auto max-w-full max-h-full rounded-lg">
          </div>

          <!-- Close Button -->
          <button (click)="closeModal()" class="fixed top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 md:p-3 z-[52]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <!-- Prev Button -->
          <button (click)="prevImage($event)" class="fixed left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 md:p-3 z-[52]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <!-- Next Button -->
          <button (click)="nextImage($event)" class="fixed right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 md:p-3 z-[52]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>
          
          <!-- Image Counter -->
          <div class="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm z-[52]">
            Bild {{ currentImageIndex() + 1 }} / {{ selectedProject()?.images.length }}
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in {
      animation: fadeIn 0.3s ease-out forwards;
    }
    .animate-fade-out {
      animation: fadeOut 0.3s ease-in forwards;
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes fadeOut {
      from { opacity: 1; }
      to { opacity: 0; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(window:keydown.escape)': 'closeModal()'
  }
})
export class ProjektenComponent {
  projects = signal<GalleryProject[]>([
    {
      id: 1,
      title: 'BETREUUNGSVERLAUF',
      category: 'Angular App',
      description: 'Eigenverantwortliche Konzeption und Entwicklung einer SPA zur Digitalisierung und Verwaltung von Betreuungsabläufen. Umsetzung eines interaktiven Dashboards zur Echtzeit-Überwachung medizinischer Daten und zur Dokumentation des Betreuungsfortschritts.',
      images: [
        'https://i.postimg.cc/hjBy4xpy/1.png',
        'https://i.postimg.cc/d1YHQd45/2.png',
        'https://i.postimg.cc/MTSPZRdt/3.png',
        'https://i.postimg.cc/bJhCYb3V/4.png',
        'https://i.postimg.cc/ZRS7Y3VM/5.png',
        'https://i.postimg.cc/rmknyWQH/6.png'
      ],
      demoInfo: {
        url: 'https://bv-demo.vercel.app/#/login',
        user: 'Testbenutzer',
        pass: 'KeepItSimple'
      }
    },
    {
      id: 2,
      title: 'INVEX – Clientseitiges ERP-System für den Einzelhandel',
      category: 'Angular & IndexedDB',
      description: 'Konzeption und Entwicklung einer umfassenden Single-Page-Anwendung (SPA) mit Angular zur Verwaltung von kleinen bis mittelständischen Einzelhandelsunternehmen (z.B. Eisenwarengeschäfte).',
      images: [
        'https://i.postimg.cc/K8938yfN/1.png',
        'https://i.postimg.cc/mgd1gGjN/2.png',
        'https://i.postimg.cc/T3k53X00/3.png',
        'https://i.postimg.cc/JzTHzWx5/4.png',
        'https://i.postimg.cc/CxvnxV76/5.png',
        'https://i.postimg.cc/vZPxZdhK/6.png',
        'https://i.postimg.cc/Z5fv5h2/7.png',
        'https://i.postimg.cc/rwhRwLjB/8.png'
      ],
      demoInfo: {
        url: 'https://invex-demo.vercel.app/#/login',
        user: 'Testbenutzer',
        pass: 'KeepItSimple'
      }
    },
    {
      id: 3,
      title: 'UI/UX Designer & Projektkonzeption',
      category: 'UI/UX Design & Konzeption',
      description: 'Konzeption einer App zur Marktanalyse durch die Analyse von Verkaufsdaten und Produktaktionen, um den globalen Verkaufsfluss zu steigern. Dieses Projekt umfasste ausschließlich die UI/UX-Gestaltung und das Projektdesign.',
      images: [
        'https://i.postimg.cc/0jxH2m2k/App-Phi-Analyse6.png',
        'https://i.postimg.cc/6q0b73yq/App-Phi-Analyse12.png',
        'https://i.postimg.cc/Xq81ZJpj/App-Phi-Analyse10.png',
        'https://i.postimg.cc/fyKq3LJk/App-Phi-Analyse11.png',
        'https://i.postimg.cc/4y52Kdm3/App-Phi-Analyse13.png',
        'https://i.postimg.cc/8cHXF5j7/App-Phi-Analyse14.png',
        'https://i.postimg.cc/prx1X8Xr/App-Phi-Analyse5.png',
        'https://i.postimg.cc/rscYFWFm/App-Phi-Analyse8.png',
        'https://i.postimg.cc/Fzmnscs1/App-Phi-Analyse9.png'
      ]
    },
     {
      id: 4,
      title: 'Andere Projekte',
      category: 'Verschiedene Projekte',
      description: 'Andere Projekte vor 2024.',
      images: [
        'https://i.postimg.cc/wj6szkK4/14.jpg',
        'https://i.postimg.cc/QdXWDqLw/17.jpg',
        'https://i.postimg.cc/fRBSR0ZC/18.jpg',
        'https://i.postimg.cc/wj6szkKP/16.jpg',
        'https://i.postimg.cc/g2NL26dN/19.jpg',
        'https://i.postimg.cc/XYVyWgMz/15.jpg',
        'https://i.postimg.cc/BnMPn1sh/20.jpg',
        'https://i.postimg.cc/g2Y6pK9h/2.png',
        'https://i.postimg.cc/Sxyz4G0C/1.png',
        'https://i.postimg.cc/MpWjwYk1/3.png',
        'https://i.postimg.cc/3xKDhZMp/4.png',
        'https://i.postimg.cc/MpWjwYk0/5.png',
        'https://i.postimg.cc/cLs8WcqR/6.png',
        'https://i.postimg.cc/3xKDhZMZ/7.png',
        'https://i.postimg.cc/9QJwQqV1/21.png',
        'https://i.postimg.cc/zG0HGR5P/22.png',
        'https://i.postimg.cc/2S2LSBmK/23.png',
        'https://i.postimg.cc/K8Zgb5XD/8.png',
        'https://i.postimg.cc/jSsJThVv/9.png',
        'https://i.postimg.cc/0y8JvCgn/10.png',
        'https://i.postimg.cc/L8HZSVdN/11.png',
        'https://i.postimg.cc/L8HZSVdx/12.png',
        'https://i.postimg.cc/nhHQx18d/13.png'
      ]
    }
  ]);

  selectedProject = signal<GalleryProject | null>(null);
  currentImageIndex = signal(0);
  isClosing = signal(false);

  currentImageUrl = computed(() => {
    const project = this.selectedProject();
    const index = this.currentImageIndex();
    return project ? project.images[index] : '';
  });

  openModal(project: GalleryProject, index: number): void {
    this.selectedProject.set(project);
    this.currentImageIndex.set(index);
    this.isClosing.set(false);
  }

  closeModal(): void {
    if (this.isClosing() || !this.selectedProject()) return;
    
    this.isClosing.set(true);
    setTimeout(() => {
        this.selectedProject.set(null);
        this.isClosing.set(false);
    }, 300); // Duration should match animation duration
  }

  nextImage(event: MouseEvent): void {
    event.stopPropagation();
    const project = this.selectedProject();
    if (project) {
      this.currentImageIndex.update(index => (index + 1) % project.images.length);
    }
  }

  prevImage(event: MouseEvent): void {
    event.stopPropagation();
    const project = this.selectedProject();
    if (project) {
      this.currentImageIndex.update(index => (index - 1 + project.images.length) % project.images.length);
    }
  }
}