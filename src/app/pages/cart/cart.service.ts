import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}
  private cartKey = 'shopping_cart';

  getCart(): any[] {
    return JSON.parse(localStorage.getItem(this.cartKey) || '[]');
  }

  saveCart(cart: any[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
  }

  addToCart(item: any): void {
    const cart = this.getCart();
    const existing = cart.find((i: any) => i.product_id === item.product_id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    this.saveCart(cart);
  }

  addToCartDB(listing_id: number, token: string) {
    return this.http.post('https://rebook-bmsd22a.bbzwinf.ch/backend/add-to-cart.php', {
      listing_id: listing_id
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  clearCart(): void {
    localStorage.removeItem(this.cartKey);
  }
}
