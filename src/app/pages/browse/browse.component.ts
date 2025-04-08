import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
export class BrowseComponent implements OnInit {
  searchTerm: string = '';
  selectedSubjects: string[] = [];
  selectedCategory: string | null = null;
  minPrice: number | null = null;
  maxPrice: number | null = null;

  books = [
    {
      title: 'ZGB/OR',
      author: 'Ernst A. Schraner',
      price: 9.90,
      image: '/zgb.jpg',
      subject: 'Law',
      category: 'School Books'
    },
    {
      title: 'Brennpunkt Wirtschaft Und Gesellschaft 1',
      author: 'Heinz Rolfesnach',
      price: 30.00,
      image: '/wirtschaft_ordner.jpeg',
      subject: 'Economy',
      category: 'School Books'
    },
    {
      title: 'Finanz- und Rechnungswesen - Grundlagen 1',
      author: 'Ernst Keller',
      price: 23.90,
      image: '/frw1.webp',
      subject: 'Finance',
      category: 'School Books'
    },
    {
      title: 'Finanz- und Rechnungswesen - Grundlagen 2',
      author: 'Ernst Keller',
      price: 25.90,
      image: '/frw2.webp',
      subject: 'Finance',
      category: 'School Books'
    },
    {
      title: 'Systematische Übungsgrammatik',
      author: 'Hueber Verlag',
      price: 25.90,
      image: '/grammatik.jpg',
      subject: 'Language',
      category: 'School Books'
    },
  ];

  categories = ['School Books', 'School Material', 'Learning Material'];

  openedFilters: Record<string, boolean> = {
    price: true,
    category: true,
    subject: true
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['subject']) {
        this.selectedSubjects = [params['subject']];
      }
    });
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

  protected readonly parseFloat = parseFloat;
}
