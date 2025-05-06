import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {lastValueFrom} from 'rxjs';
import {SellService} from './sell.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
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
    description: '',
    price: '',
    category: ''
  };

  constructor(private http: HttpClient,
              private uploadService: SellService) {}

  upload() {
    //const response = await lastValueFrom(this.uploadService.uploadListing(this.user));
    console.log('Proof that it enters function')
    const formData = new FormData();

    formData.append('title', this.product.title);
    formData.append('description', this.product.description);
    formData.append('price', this.product.price);
    formData.append('category', this.product.category);

    if (this.selectedImage) {
      console.log('Proof that it finds the image')
      formData.append('image', this.selectedImage);
    }

    const token = localStorage.getItem('token');
    if (!token) {
      this.message = 'You must be logged in to upload';
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
        this.product = { title: '', description: '', price: '', category: '' };
        this.selectedImage = null;
      },
      error: err => {
        console.error(err);
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
}
