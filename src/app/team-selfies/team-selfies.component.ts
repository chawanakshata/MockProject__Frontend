import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { FormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { API_ENDPOINTS } from '../api-endpoints'; 

@Component({
  selector: 'app-team-selfies',
  standalone: true,
  imports: [CommonModule, SlickCarouselModule, FormsModule, MatSnackBarModule, MatProgressSpinnerModule],
  templateUrl: './team-selfies.component.html',
  styleUrls: ['./team-selfies.component.css']
})

export class TeamSelfiesComponent implements OnInit {
  selfies: any[] = [];
  userRole: string = ''; 
  isLoading = true; // Indicates whether the data is still being loaded
  carouselConfig = {
    dots: true, 
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: true,
    pauseOnHover: true,
    accessibility: true
  };
  
  teamMemberName: string = '';
  selectedFile: File | null = null;
  selectedFileName: string = '';
  currentSlide = 0;

  constructor(private http: HttpClient, private snackBar: MatSnackBar) {}
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  ngOnInit(): void {
    this.userRole = sessionStorage.getItem('userRole') || '';
    this.isLoading = true; // Set loading state to true
    this.http.get<any[]>(API_ENDPOINTS.TEAM_SELFIES)
      .subscribe({
        next: data => {
          this.selfies = data;
          this.isLoading = false; // Set loading state to false
        },
        error: (err: any) => {
        this.isLoading = false;
        const errorMsg = err?.error?.Message || err?.error?.message || 'Failed to load selfies.';
        this.snackBar.open(errorMsg, 'Close', {
          duration: 4000,
          verticalPosition: 'bottom',
          panelClass: 'photo-snackbar'
        });
      }
      });
  }

// The onFileSelected method is triggered when a file is selected from the file input.
onFileSelected(event: Event) {
  const input = event.target as HTMLInputElement; // Lets you access the file input’s properties (like input.files) 
  if (input.files && input.files.length > 0) { // Checks if the input has files and if so, assigns the first file to selectedFile
    this.selectedFile = input.files[0]; 
    this.selectedFileName = this.selectedFile.name; // Gets the name of the selected file
  }
}

addSelfie() {
  const formData = new FormData();
  if (this.selectedFile) {
    formData.append('File', this.selectedFile);
  }
  formData.append('TeamMemberName', this.teamMemberName.trim());

  this.http.post<any>(API_ENDPOINTS.TEAM_SELFIES_UPLOAD, formData)
    .subscribe({
      next: (newSelfie) => {
        this.selfies = [...this.selfies, newSelfie];
        this.teamMemberName = '';
        this.selectedFile = null;
        this.selectedFileName = '';
        if (this.fileInput && this.fileInput.nativeElement) {
          this.fileInput.nativeElement.value = '';
        }
        this.snackBar.open('Photo added successfully', 'Close', {
          duration: 4000,
          verticalPosition: 'bottom',
          panelClass: 'photo-snackbar'
        });
      },
      error: (err: any) => {
        // Show backend error message if available (handles both "Message" and "message")
        const errorMsg = err?.error?.Message || err?.error?.message || 'Failed to upload photo.';
        this.snackBar.open(errorMsg, 'Close', {
          duration: 4000,
          verticalPosition: 'bottom',
          panelClass: 'photo-snackbar'
        });
      }
    });
}

  deleteSelfie(id: number) {
    if (confirm('Are you sure you want to delete this selfie?')) {
      this.http.delete(API_ENDPOINTS.TEAM_SELFIES_DELETE(id))
        .subscribe({
          next: () => {
            this.selfies = this.selfies.filter(s => s.id !== id); // Includes only those selfies whose id is not equal to the one you want to delete.
            this.snackBar.open('Photo deleted successfully', 'Close', {
              duration: 4000,
              verticalPosition: 'bottom',
              panelClass: 'photo-snackbar'
            });
          },
          error: (err) => {
          const errorMsg = err?.error?.Message || 'Failed to delete selfie.';
          this.snackBar.open(errorMsg, 'Close', {
            duration: 4000,
            verticalPosition: 'bottom',
            panelClass: 'photo-snackbar'
          });
        }
        });
    }
  }
  
  onCarouselAfterChange(event: any) {
    this.currentSlide = event.currentSlide || 0; // Sets the current slide index based on the event data
  }
  
}