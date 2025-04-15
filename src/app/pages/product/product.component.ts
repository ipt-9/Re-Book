import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {NavbarComponent} from '../navbar/navbar.component';
import {FooterComponent} from '../footer/footer.component';

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.component.html',
  imports: [
    NavbarComponent,
    FooterComponent,
    RouterLink
  ],
  styleUrls: ['./product.component.scss', '../../../styles.scss']
})
export class ProductComponent implements OnInit {
  product: any;
  productId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.productId = this.route.snapshot.queryParamMap.get('id');
    if (this.productId) {
      this.http.get<any[]>('https://rebook-bmsd22a.bbzwinf.ch/backend/get_books.php')
        .subscribe({
          next: books => {
            this.product = books.find(b => b.product_id == this.productId);
          },
          error: err => console.error('Failed to fetch books', err)
        });
    }
  }
}
