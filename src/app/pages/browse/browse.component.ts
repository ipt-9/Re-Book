import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
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
export class BrowseComponent {
  searchTerm: string = '';

  books = [
    {
      title: 'ZGB/OR',
      author: 'Ernst A. Schraner',
      price: 9.90,
      image: '/zgb.jpg',
    },
    {
      title: 'Brennpunkt Wirtschaft Und Gesellschaft 1',
      author: 'Heinz Rolfesnach',
      price: 30.00,
      image: '/wirtschaft_ordner.jpeg',
    },
    {
      title: 'Finanz- und Rechnungswesen - Grundlagen 1',
      author: 'Ernst Keller',
      price: 23.90,
      image: '/frw1.webp',
    },
    {
      title: 'Finanz- und Rechnungswesen - Grundlagen 2',
      author: 'Ernst Keller',
      price: 25.90,
      image: '/frw2.webp',
    },
    {
      title: 'Systematische Übungsgrammatik',
      author: 'Hueber Verlag',
      price: 25.90,
      image: '/grammatik.jpg',
    },
  ];

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
