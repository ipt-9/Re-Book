import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { CartService } from '../cart/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  imports: [
    CommonModule,
    NavbarComponent,
    FooterComponent,
    RouterLink
  ],
  styleUrls: ['./product.component.scss', '../../../styles.scss']

})
export class ProductComponent implements OnInit {
  product: any;
  productId: string | null = null;
  topBooks: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProductAndTopBooks();
  }

  loadProductAndTopBooks(): void {
    this.http.get<any[]>('https://rebook-bmsd22a.bbzwinf.ch/backend/get_books.php')
      .subscribe({
        next: books => {
          this.productId = this.route.snapshot.queryParamMap.get('id');
          if (this.productId) {
            this.product = books.find(b => b.product_id == this.productId);
          }
          this.topBooks = books
            .filter(b => b.product_id != this.productId) // Exclude current product
            .slice(0, 4); // Just 4 picks
        },
        error: err => console.error('Failed to load book(s)', err)
      });
  }

  addToCart(): void {
    const token = localStorage.getItem('user_token');
    const listingId = this.product?.listing_id; // depends on your data

    if (token && listingId) {
      this.cartService.addToCartDB(listingId, token).subscribe({
        next: () => this.router.navigate(['/cart']),
        error: err => console.error('Failed to add to cart', err)
      });
    }
  }


}
