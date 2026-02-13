import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GalleryProject {
  id: number;
  title: string;
  category: string;
  images: string[];
  description: string;
}

@Component({
  selector: 'app-sonstiges',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto max-w-[1200px] p-4 md:p-8">
      <header class="text-left mb-8 md:mb-12">
        <h1 class="text-4xl md:text-5xl font-bold text-gray-800">Sonstiges</h1>
        <p class="mt-2 text-lg text-gray-600">Dies sind Zertifikate und Anerkennungen, die ich in Deutschland erhalten habe.</p>
      </header>
      
      <!-- Projects Pages -->
      <div class="space-y-12">
        @for (project of projects(); track project.id) {
          <section class="bg-white p-6 md:p-10 shadow-lg border border-gray-200 rounded-lg">
            <!-- Image Gallery -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              @for (image of project.images; track image; let i = $index) {
                <div (click)="openModal(project, i)" class="group relative rounded-lg overflow-hidden cursor-pointer border border-gray-200 shadow-sm transition-shadow duration-300 hover:shadow-md">
                  <img [src]="image" [alt]="project.title + ' Bild ' + (i + 1)" class="w-full h-auto object-cover aspect-video transition-transform duration-300 group-hover:scale-105">
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
          <div class="relative w-full h-full flex items-center justify-center p-4 pb-12" (click)="$event.stopPropagation()">
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
export class SonstigesComponent {
  projects = signal<GalleryProject[]>([
    {
      id: 4,
      title: 'Sonstiges',
      category: 'Sonstiges',
      description: 'Eine Sammlung meiner Zertifikate und Anerkennungen, die ich in Deutschland erworben habe. Diese Dokumente belegen meine Qualifikationen und beruflichen Weiterbildungen.',
      images: [
        'https://i.postimg.cc/JzyB5KLg/2.jpg',
        'https://i.postimg.cc/mgcFyVsK/4.png',
        'https://i.postimg.cc/rwdtNgkv/1.jpg',
        'https://i.postimg.cc/htHQyxDw/10.jpg',
         'https://i.postimg.cc/Bn81BN39/7.jpg',
        'https://i.postimg.cc/W1DJwSvC/5.jpg',
        'https://i.postimg.cc/RZ3nLGmr/6.jpg',
        'https://i.postimg.cc/kgkR18Jj/8.png',
        'https://i.postimg.cc/NjW2JTsS/9.png'
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