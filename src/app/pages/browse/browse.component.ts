import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    NavbarComponent,
    FooterComponent,
    FormsModule
  ],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss', '../../../styles.scss']
})
export class BrowseComponent implements OnInit {
  searchTerm: string = '';
  selectedSubjects: string[] = [];
  selectedCategory: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  books: any[] = [];
  categories = ['School Books', 'School Material', 'Learning Material'];

  openedFilters: Record<string, boolean> = {
    price: true,
    category: true,
    subject: true
  };

  constructor(
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // URL-Filter (Query-Parameter) übernehmen
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['subject']) {
        this.selectedSubjects = [params['subject']];
      }
    });

    // Bücher vom Backend laden
    this.loadBooks();
  }

  private getBooks(): Observable<any[]> {
    const apiUrl = 'https://rebook-bmsd22a.bbzwinf.ch/backend/get_books.php';
    return this.http.get<any[]>(apiUrl);
  }

  loadBooks(): void {
    this.getBooks().subscribe({
      next: (data) => this.books = data,
      error: (err) => console.error('Failed to load books', err)
    });
  }

  filteredBooks() {
    const term = this.searchTerm.toLowerCase().trim();

    return this.books.filter(book => {
      const matchesSearch = !term ||
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term);

      const matchesSubject = this.selectedSubjects.length === 0 ||
        this.selectedSubjects.includes(book.subject);

      const matchesCategory = !this.selectedCategory ||
        book.category === this.selectedCategory;

      const matchesMin = this.minPrice === null || book.price >= this.minPrice;
      const matchesMax = this.maxPrice === null || book.price <= this.maxPrice;

      return matchesSearch && matchesSubject && matchesCategory && matchesMin && matchesMax;
    });
  }

  onSearch(): void {
    console.log('Searching for:', this.searchTerm);
  }

  toggle(section: string): void {
    this.openedFilters[section] = !this.openedFilters[section];
  }

  isOpen(section: string): boolean {
    return this.openedFilters[section];
  }

  toggleSubject(subject: string): void {
    const index = this.selectedSubjects.indexOf(subject);
    if (index > -1) {
      this.selectedSubjects.splice(index, 1);
    } else {
      this.selectedSubjects.push(subject);
    }
  }

  selectCategory(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? null : category;
  }

  protected readonly parseFloat = parseFloat;
}
