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

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>('https://rebook-bmsd22a.bbzwinf.ch/backend/cart.php', { headers })
      .subscribe(res => {
        this.cart = res;
      });
  }

  getTotal(): string {
    return this.cart.reduce((acc, item) => acc + parseFloat(item.price), 0).toFixed(2);
  }

  submitPayment(): void {
    // Normally, you'd call a payment gateway. Here we just simulate success.
    const token = localStorage.getItem('token');
    if (!token) return;

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Send DELETE request for each item
    const deleteRequests = this.cart.map(item =>
      this.http.post('https://rebook-bmsd22a.bbzwinf.ch/backend/cart/delete_item.php',
        { listing_id: item.listing_id },
        { headers }
      ).toPromise()
    );

    Promise.all(deleteRequests).then(() => {
      this.router.navigate(['/confirm']);
    });
  }
}
