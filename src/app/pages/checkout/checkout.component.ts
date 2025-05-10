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

    this.http.get<any>('https://rebook-bmsd22a.bbzwinf.ch/backend/get_cart.php', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).subscribe({
      next: res => {
        this.cart = res.data || [];
        this.total_price = this.cart.reduce((sum, item) =>
          sum + item.quantity * parseFloat(item.price), 0
        );
      },
      error: err => {
        console.error('Failed to load cart', err);
      }
    });
  }
}
