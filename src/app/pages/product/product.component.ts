import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../favorites/favorites.service';
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
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.productId = params.get('id');
      this.loadProductAndTopBooks(); // call method after ID is updated
    });
  }

  loadProductAndTopBooks(): void {
    this.http.get<any[]>('https://rebook-bmsd22a.bbzwinf.ch/backend/get_books.php')
      .subscribe({
        next: books => {
          if (this.productId) {
            this.product = books.find(b => b.product_id == this.productId);
          }
          this.topBooks = books
            .filter(b => b.product_id != this.productId)
            .slice(0, 4);
        },
        error: err => console.error('Failed to load book(s)', err)
      });
  }


  addToCart(): void {
    const token = this.authService.getToken();
    const listingId = this.product?.listing_id;
    console.log('Product:', this.product);
    console.log('Listing ID:', listingId);


    if (!token || !listingId) {
      console.error('Missing token or listing ID');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    const body = {
      listing_id: listingId,
      quantity: 1 // or let user choose
    };

    this.http.post('https://rebook-bmsd22a.bbzwinf.ch/backend/add-to-cart.php', body, { headers }).subscribe({
      next: (response: any) => {
        alert(response.message); // or use a nicer toast service
        this.router.navigate(['/cart']); // optional: go to cart
      },
      error: err => {
        console.error('Failed to add to cart', err);
        alert('Error adding to cart.');
      }
    });

  }

  addToFavorites(book: any): void {
    this.favoritesService.add(book);
  }
}
