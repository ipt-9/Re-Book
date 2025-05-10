import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { SellService } from './sell.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NavbarComponent,
    FooterComponent
  ],
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss', '../../../styles.scss']
})
export class SellComponent {
  selectedImage: File | null = null;
  message: string = '';
  isSuccess: boolean = false;

  product = {
    title: '',
    author: '',
    description: '',
    price: '',
    subject: '',
    category: ''
  };

  constructor(private http: HttpClient, private uploadService: SellService, private router: Router,) {}

  upload(): void {
    console.log('Entered upload() function');

    if (!this.product.title || !this.product.price) {
      this.message = 'Please fill in all required fields.';
      this.isSuccess = false;
      return;
    }

    const formData = new FormData();
    Object.entries(this.product).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (this.selectedImage) {
      console.log('Image selected');
      formData.append('image', this.selectedImage);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.message = 'You must be logged in to upload.';
      this.isSuccess = false;
      return;
    }

    this.http.post(
      'https://rebook-bmsd22a.bbzwinf.ch/backend/upload-listing.php',
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    ).subscribe({
      next: res => {
        console.log('Uploaded:', res);
        this.message = 'Upload successful!';
        this.isSuccess = true;
        alert('Item uploaded successfully.');
        this.resetForm();
        this.router.navigate(['/profile']);
      },
      error: err => {
        console.error('Upload error:', err);
        this.message = 'Upload failed.';
        this.isSuccess = false;
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedImage = input.files[0];
    }
  }

  private resetForm(): void {
    this.product = {
      title: '',
      author: '',
      description: '',
      price: '',
      subject: '',
      category: ''
    };
    this.selectedImage = null;
  }
}
