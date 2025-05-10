import {Component, OnInit} from '@angular/core';
import { RouterLink, Router } from '@angular/router';
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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    console.log('🛒 CartComponent INIT');

    const token = localStorage.getItem('token');
    console.log('🧾 Token:', token);

    if (!token) {
      console.error('⛔ Kein Token in localStorage gefunden');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('https://rebook-bmsd22a.bbzwinf.ch/backend/get-cart.php', { headers })
      .pipe(
        catchError(error => {
          console.error('📛 HTTP error:', error);
          return of({ success: false, data: [] });
        })
      )
      .subscribe({
        next: res => {
          console.log('✅ Cart data received:', res);
          if (res.success && Array.isArray(res.data)) {
            this.cart = res.data;
            console.table(this.cart);
          } else {
            console.warn('⚠️ Unerwartete Antwortstruktur oder keine Daten:', res);
            this.cart = [];
          }
        },
        error: err => {
          console.error('❌ Verarbeitungsfehler:', err);
        }
      });

  }

  removeItem(index: number): void {
    const item = this.cart[index];
    this.http.post('https://rebook-bmsd22a.bbzwinf.ch/backend/remove_item.php', {
      listing_id: item.listing_id
    }).subscribe({
      next: () => {
        this.cart.splice(index, 1); // Only update UI if backend deletion was successful
      },
      error: err => {
        console.error('❌ Failed to remove item:', err);
        alert('Error removing item from cart');
      }
    });
  }


  getTotalPrice(): string {
    const total = this.cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
    return `CHF ${total.toFixed(2)}`;
  }

  createOrder(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post<any>(
      'https://rebook-bmsd22a.bbzwinf.ch/backend/create_order.php',
      {},
      { headers }
    ).subscribe({
      next: res => {
        if (res.success) {
          console.log('✅ Order created:', res);
          this.router.navigate(['/checkout']); // navigate after successful order
        } else {
          alert('Order creation failed');
        }
      },
      error: err => {
        console.error('❌ Order error:', err);
        alert('Error while creating order');
      }
    });
  }


}
