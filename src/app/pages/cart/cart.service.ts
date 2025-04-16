import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class CartService {
  constructor(private http: HttpClient) {}
  private cartKey = 'shopping_cart';

  addToCartDB(listing_id: number, token: string) {
    return this.http.post('https://rebook-bmsd22a.bbzwinf.ch/backend/add-to-cart.php', {
      listing_id: listing_id
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }

}
