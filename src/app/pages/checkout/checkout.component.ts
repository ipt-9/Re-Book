import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent,
    FormsModule
  ]
})
export class CheckoutComponent implements OnInit {
  cart: any[] = [];
  card = { name: '', number: '', expiry: '', cvv: '' };
  total_price = 0;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<any>('https://rebook-bmsd22a.bbzwinf.ch/backend/get-cart.php', { headers })
      .subscribe({
        next: res => {
          this.cart = res.data || [];
          this.total_price = this.cart.reduce((sum, item) => sum + parseFloat(item.price), 0);
        },
        error: err => {
          console.error('❌ Error loading cart:', err);
        }
      });
  }

  submitPayment(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
    if (this.cart.length === 0) {
      alert('🛒 Your cart is empty.');
      return;
    }
    this.http.post<any>('https://rebook-bmsd22a.bbzwinf.ch/backend/checkout.php', { card: this.card }, { headers })
      .subscribe({
        next: res => {
          if (res.success) {
            console.log('✅ Checkout successful:', res);
            this.router.navigate(['/confirmation']);
          } else {
            alert('❌ Checkout failed. Please try again.');
          }
        },
        error: err => {
          if (err.status === 422) {
            alert('⚠️ Invalid card details');
          } else {
            console.error('❌ Payment error:', err);
            alert('Payment processing failed.');
          }
        }
      });
  }
}
