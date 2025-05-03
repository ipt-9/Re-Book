import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private favorites: any[] = [];

  add(book: any): void {
    if (!this.favorites.find(b => b.product_id === book.product_id)) {
      this.favorites.push(book);
    }
  }

  getAll(): any[] {
    return this.favorites;
  }

  remove(product_id: number): void {
    this.favorites = this.favorites.filter(b => b.product_id !== product_id);
  }
}
