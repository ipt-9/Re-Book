import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
export class BrowseComponent {
  searchTerm: string = '';
  selectedSubjects: string[] = [];
  selectedCategory: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  books: any[] = [];
  categories = ['School Books', 'School Material', 'Learning Material'];

  constructor(private http: HttpClient) {
  }

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.http.get<any[]>('https://rebook-bmsd22a.bbzwinf.ch/backend/get_books.php').subscribe({
      next: (data) => this.books = data,
      error: (err) => console.error('Failed to load books', err)
    });
  }

  // ⬇️ Main filtering logic
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

  // ⬇️ Filter toggle
  openedFilters: Record<string, boolean> = {
    price: true,
    category: true,
    subject: true
  };

  toggle(section: string): void {
    this.openedFilters[section] = !this.openedFilters[section];
  }

  isOpen(section: string): boolean {
    return this.openedFilters[section];
  }

  // ⬇️ Subject click toggle
  toggleSubject(subject: string): void {
    const index = this.selectedSubjects.indexOf(subject);
    if (index > -1) {
      this.selectedSubjects.splice(index, 1);
    } else {
      this.selectedSubjects.push(subject);
    }
  }

  // ⬇️ Category selection (single selection)
  selectCategory(category: string): void {
    this.selectedCategory = this.selectedCategory === category ? null : category;
  }

  protected readonly parseFloat = parseFloat;
}
