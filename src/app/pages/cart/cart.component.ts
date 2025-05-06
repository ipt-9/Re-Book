import {Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

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
    const token = localStorage.getItem('token'); // fix the key

    if (token) {
      this.http.get<any[]>(
        'https://rebook-bmsd22a.bbzwinf.ch/backend/get-cart.php',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      ).subscribe({
        next: data => {
          console.log('Cart data:', data);
          this.cart = data;
        },
        error: err => {
          console.error('Failed to load cart', err);
          alert('Error loading cart: ' + (err.error?.message || 'Unknown error'));
        }
      });
    }
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
    const total = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return `CHF ${total.toFixed(2)}`;
  }
}
