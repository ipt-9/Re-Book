import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';

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
export class CartComponent {
  cart = [
    {
      title: 'ZGB/OR',
      author: 'Ernst A. Schraner',
      price: 9.90,
      quantity: 1,
      image: '/zgb.jpg'
    },
    {
      title: 'Brennpunkt Wirtschaft Und Gesellschaft 1',
      author: 'Heinz Rolfesnach',
      price: 32.00,
      quantity: 1,
      image: '/wirtschaft_ordner.jpeg'
    },
    {
      title: 'Finanz- und Rechnungswesen - Grundlagen 2',
      author: 'Ernst Keller',
      price: 19.90,
      quantity: 1,
      image: '/frw1.webp'
    }
  ];

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
