import { Injectable } from '@angular/core';

// This is the global emailjs object from the script loaded in index.html
declare var emailjs: any;

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  // IMPORTANT: These IDs would need to be replaced with your actual EmailJS account details.
  // You can get them for free at https://www.emailjs.com
  private readonly SERVICE_ID = 'service_b1quo05';
  private readonly TEMPLATE_ID = 'template_4dc6pft';
  private readonly PUBLIC_KEY = 'Fri6uQd2K4iQWasNe';

  async sendLoginDetails(toEmail: string): Promise<void> {
    
    // In a real application, emailjs.send would be used.
    // Since we don't have real credentials, we will simulate the email sending.
    if (this.SERVICE_ID !== 'service_b1quo05') {
      console.log(`
        EmailJS is not configured. Simulating email send.
        To: ${toEmail}
        Subject: Zugangsdaten für den Lebenslauf von David Castillo
        
        Hallo,
        
        vielen Dank für Ihr Interesse an meinem Profil.
        
        Hier sind die Zugangsdaten, um meinen Lebenslauf einzusehen:
        - Benutzername: Gast
        - Passwort: KeepItSimple
        
        Mit freundlichen Grüßen,
        David Castillo
        Softwareentwickler
      `);
      // Simulate network delay
      return new Promise(resolve => setTimeout(resolve, 1000));
    }

    const templateParams = {
      to_email: toEmail,
      from_name: 'David Castillo',
      username: 'Gast',
      password: 'KeepItSimple'
    };

    try {
      await emailjs.send(this.SERVICE_ID, this.TEMPLATE_ID, templateParams, this.PUBLIC_KEY);
      console.log('Access email sent successfully!');
    } catch (error) {
      console.error('Failed to send email:', error);
      // Re-throw the error to be handled by the component
      throw new Error('Failed to send access email.');
    }
  }
}

/**
 * To make this work with a real EmailJS account, you would also need to create an email template.
 * Example Template (in EmailJS dashboard):
 * 
 * Subject: Zugangsdaten für den Lebenslauf von David Castillo
 * 
 * Body:
 *   Hallo,
 * 
 *   vielen Dank für Ihr Interesse an meinem Profil.
 * 
 *   Hier sind die Zugangsdaten, um meinen Lebenslauf einzusehen:
 *   - Benutzername: {{username}}
 *   - Passwort: {{password}}
 * 
 *   Mit freundlichen Grüßen,
 *   David Castillo
 *   Softwareentwickler
 */
