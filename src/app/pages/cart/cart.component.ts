import {Component, OnInit} from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
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
      console.error('⛔ No token found in localStorage');
      return;
    }

    this.http.get<any[]>(
      'https://rebook-bmsd22a.bbzwinf.ch/backend/get-cart.php',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).pipe(
      catchError(error => {
        console.error('📛 Caught HTTP error:', error);
        return of([]); // leeres Array zurückgeben
      })
    ).subscribe({
      next: data => {
        console.log('✅ Cart data received:', data);
        this.cart = data;
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
    const total = this.cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return `CHF ${total.toFixed(2)}`;
  }
}
