import { Component } from '@angular/core';
import {RouterLink} from "@angular/router";
import { NavbarComponent } from '../navbar/navbar.component';
import { FooterComponent } from '../footer/footer.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
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

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.selectedImage = event.target.files[0];
    }
  }

  onSubmit() {
    const formData = new FormData();
    for (const key in this.productForm.value) {
      formData.append(key, this.productForm.value[key]);
    }

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    this.http.post('http://rebook-bmsd22a.bbzwinf.ch/httpdocs/backend/upload-listing.php', formData)
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
  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer?.files.length) {
      this.selectedImage = event.dataTransfer.files[0];
    }
  }
}
