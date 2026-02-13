import { Component, ChangeDetectionStrategy, signal, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiService, ChatMessage } from '../services/gemini.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  standalone: true,
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [GeminiService],
})
export class ChatComponent {
  private geminiService = inject(GeminiService);
  
  messages = signal<ChatMessage[]>([
    { role: 'model', text: 'Hallo! Fragen Sie mich etwas über Davids Lebenslauf.' }
  ]);
  currentMessage = signal('');
  isLoading = signal(false);
  
  async sendMessage(): Promise<void> {
    const userMessage = this.currentMessage().trim();
    if (!userMessage || this.isLoading()) return;
    
    // Add user message to chat
    this.messages.update(msgs => [...msgs, { role: 'user', text: userMessage }]);
    const history = this.messages().slice(0, -1); // Pass history without the current user message

    this.isLoading.set(true);
    this.currentMessage.set('');

    // Prepare for model's streaming response
    this.messages.update(msgs => [...msgs, { role: 'model', text: '' }]);

    try {
      const stream = this.geminiService.askAboutCvStream(userMessage, history);
      for await (const chunk of stream) {
        this.messages.update(msgs => {
            const lastMsg = msgs[msgs.length - 1];
            if (lastMsg) {
                lastMsg.text += chunk;
            }
            return [...msgs];
        });
      }
    } catch (e) {
      this.messages.update(msgs => {
          const lastMsg = msgs[msgs.length - 1];
          if (lastMsg) {
            lastMsg.text = 'Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.';
          }
          return [...msgs];
      });
    } finally {
        this.isLoading.set(false);
    }
  }

  askSuggestion(suggestion: string) {
    this.currentMessage.set(suggestion);
    this.sendMessage();
  }
}
