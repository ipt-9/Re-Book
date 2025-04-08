import { Component, OnInit } from '@angular/core';
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

export class BrowseComponent implements OnInit {
  searchTerm: string = '';
  books: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.http.get<any[]>('https://rebook-bmsd22a.bbzwinf.ch/backend/get_books.php').subscribe({
      next: (data) => this.books = data,
      error: (err) => console.error('Failed to load books', err)
    });
  }

  filteredBooks() {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) return this.books;

    return this.books.filter(book =>
      book.title.toLowerCase().includes(term) ||
      book.author.toLowerCase().includes(term)
    );
  }

  onSearch(): void {
    console.log('Searching for:', this.searchTerm);
  }

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
}