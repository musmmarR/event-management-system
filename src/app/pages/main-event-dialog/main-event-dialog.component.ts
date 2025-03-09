import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventService } from '../../services/event.service';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
@Component({
  selector: 'app-main-event-dialog',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatButtonModule,
    MatIconModule,
    NgxMatSelectSearchModule
  ],
  templateUrl: './main-event-dialog.component.html',
  styleUrl: './main-event-dialog.component.scss'
})
export class MainEventDialogComponent  implements OnInit {
  eventForm: FormGroup;
  isLoading = false;
  selectedFile: File | null = null;
  users: any;

  constructor(
    private fb: FormBuilder,
    private eventService: EventService,
    private dialogRef: MatDialogRef<MainEventDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any | null
  ) {
    console.log(data)
    this.eventForm = this.fb.group({
      title: [data?.title || '', Validators.required],
      description: [data?.description || '', Validators.required],
      date: [data?.date || '', Validators.required],
      time: [data?.time || '', Validators.required],
      location: [data?.location || '', Validators.required],
      maxParticipants: [data?.maxParticipants || '', Validators.required],
      participants: [data?.status =="pending" ? data?.pendingParticipants : data?.participants || '',[]]
    });
  }
  ngOnInit() {
    this.loadUsers();
    // ... existing initialization code
  }
  loadUsers() {
    this.eventService.getAllUsers().subscribe({
      next: (res) => {
        console.log(res)
        this.users = res.users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
      }
    });
  }
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }
  onSubmit() {
    if (this.eventForm.valid) {
      let formData = {};
      const formValue = this.eventForm.value;
      
      // Get the selected participant IDs
      if (formValue.participants && formValue.participants.length > 0) {
        // Map the selected participant IDs to their full user objects
        const selectedParticipants = this.users.filter((user: any) => 
          formValue.participants.includes(user._id)
        );

        console.log('Selected Participants:', selectedParticipants);

           formData = {
          ...formValue,
          participants: selectedParticipants
        };

        // Now you can send eventData to your service
        console.log('Event Data to submit:', formData);
        
        // Your existing submit logic here
        // this.eventService.createEvent(eventData).subscribe(...)
      }else{
        formData = {
          ...this.eventForm.value,
          participants: []
        };
      }
      this.dialogRef.close(formData);
    }
   
  }

  onCancel() {
    this.dialogRef.close();
  }
}
