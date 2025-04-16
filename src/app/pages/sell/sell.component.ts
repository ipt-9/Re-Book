import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

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
  productForm: FormGroup;
  selectedImage: File | null = null;
  message: string = '';
  isSuccess: boolean = false;
  product = {
    title : '',
    description : '',
    price : '',
    category: '', //maybe change this since it's in the form of a checkbox
    imagePath: ''
  }

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.productForm = this.fb.group({
      title: [''],
      author: [''],
      description: [''],
      subject: [''],
      category: [''],
      format: [''],
      price: [''],
      listing_condition: ['New']
    });
  }


  async uploadListing() {
    const formData = new FormData();
    for (const key in this.productForm.value) {
      formData.append(key, this.productForm.value[key]);
    }

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.http.post('https://rebook-bmsd22a.bbzwinf.ch/backend/upload-listing.php', formData)
      .subscribe({
        next: (response) => {
          this.message = 'Produkt erfolgreich hochgeladen!';
          this.isSuccess = true;
          this.productForm.reset();
        },
        error: (error) => {
          this.message = 'Fehler beim Hochladen des Produkts.';
          this.isSuccess = false;
          console.error(error);
        }
      });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
    }
  }
}
