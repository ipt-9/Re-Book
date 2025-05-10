import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
  imports: [
    RouterLink,
    NavbarComponent,
    FooterComponent
  ]
})

export class CheckoutComponent implements OnInit {
  mode: 'cart' | 'premium' | 'booster' = 'cart';
  userId: number = 0;
  items: any[] = [];
  totalPrice: number = 0;
  boosterSelection: Set<number> = new Set();

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.mode = this.route.snapshot.queryParamMap.get('mode') as any || 'cart';

    this.http.get('https://rebook-bmsd22a.bbzwinf.ch/backend/user.php', { headers })
      .subscribe((res: any) => {
        this.userId = res.user.id;

        if (this.mode === 'cart') {
          this.loadCart(headers);
        } else if (this.mode === 'booster') {
          this.loadAdvertised(headers);
        } else if (this.mode === 'premium') {
          this.totalPrice = 10;
        }
      });
  }

  loadCart(headers: HttpHeaders) {
    this.http.get('https://rebook-bmsd22a.bbzwinf.ch/backend/get_cart.php', { headers })
      .subscribe((res: any) => {
        this.items = res.items;
        this.totalPrice = this.items.reduce((sum: number, item: any) => sum + +item.price, 0);
      });
  }

  loadAdvertised(headers: HttpHeaders) {
    this.http.get('https://rebook-bmsd22a.bbzwinf.ch/backend/get_user_products.php', { headers })
      .subscribe((res: any) => {
        this.items = res.data.advertised;
      });
  }

  toggleBooster(id: number) {
    this.boosterSelection.has(id) ? this.boosterSelection.delete(id) : this.boosterSelection.add(id);
    this.totalPrice = this.boosterSelection.size * 3;
  }

  goToConfirmation(): void {
    const token = this.authService.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    if (this.mode === 'premium') {
      this.http.post('https://rebook-bmsd22a.bbzwinf.ch/backend/set_premium.php', {}, { headers }).subscribe(() => {
        this.router.navigate(['/confirmation']);
      });
    } else if (this.mode === 'booster') {
      this.http.post('https://rebook-bmsd22a.bbzwinf.ch/backend/apply_booster.php', {
        item_ids: Array.from(this.boosterSelection)
      }, { headers }).subscribe(() => {
        this.router.navigate(['/confirmation']);
      });
    } else {
      // simulate purchase, e.g. cart checkout
      this.router.navigate(['/confirmation']);
    }
  }
}
