import {Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss', '../../../styles.scss']
})
export class CartComponent implements OnInit {

  cart: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log('🛒 CartComponent INIT');

    const token = localStorage.getItem('token');
    console.log('🧾 Token:', token);

    if (!token) {
      console.error('⛔ Kein Token in localStorage gefunden');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('https://rebook-bmsd22a.bbzwinf.ch/backend/get-cart.php', { headers, responseType: 'json' as const })
      .pipe(
        catchError(error => {
          console.error('📛 HTTP Fehler beim Abrufen des Warenkorbs:', error);
          return of([]); // Leeres Array zurückgeben, um App-Absturz zu verhindern
        })
      )
      .subscribe({
        next: data => {
          if (Array.isArray(data)) {
            console.log('✅ Erfolgreich Daten empfangen:', data);
            this.cart = data;
          } else {
            console.warn('⚠️ Antwort ist kein Array:', data);
            this.cart = [];
          }
        },
        error: err => {
          console.error('❌ Fehler beim Verarbeiten der Antwort:', err);
        }
      });
  }

  increaseQuantity(item: any) {
    item.quantity++;
  }

  decreaseQuantity(item: any) {
    if (item.quantity > 1) {
      item.quantity--;
    }
  }

  removeItem(index: number) {
    this.cart.splice(index, 1);
  }

  getTotalPrice(): string {
    const total = this.cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
    return `CHF ${total.toFixed(2)}`;
  }
}
