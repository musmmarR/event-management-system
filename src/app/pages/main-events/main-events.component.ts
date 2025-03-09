import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { EventService } from '../../services/event.service';
import { MainEventDialogComponent } from '../main-event-dialog/main-event-dialog.component';
import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-main-events',
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule
  ],
  templateUrl: './main-events.component.html',
  styleUrl: './main-events.component.scss'
})
export class MainEventsComponent implements OnInit {
  events: any[] = [];
  isAdmin = false;
  userId: number | null = null;
  loading = false;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.isAdmin = this.authService.getUserFromStorage().isAdmin;
    this.userId = this.authService.getUserFromStorage().id;
    console.log(this.userId)
  }

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.loading = true;
    let params = {}
    this.eventService.getEvents(params).subscribe({
      next: (res) => {
        this.loading = false;
        console.log(res)
        this.events = res.events;
      },
      error: (error) => {
        this.showError(error.error?.error.message);
      }
    });
  }
  openEventDialog(event?: any) {
    console.log(event)
    const dialogRef = this.dialog.open(MainEventDialogComponent, {
      width: '600px',
      data: event
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (event) {
          console.log(event)
          result._id = event._id;
          this.updateEvent(result);
        } else {
          this.createEvent(result);
        }
      }
    });
  }

  createEvent(eventData: any) {
    this.eventService.createEvent(eventData).subscribe({
      next: (newEvent) => {
        console.log(newEvent)
        this.showSuccess('Event created successfully');
        this.loadEvents();
    
      },
      error: (error) => {
        this.showError(error.error?.error.message);
      }
    });
  }
  updateEvent(eventData: any) {
    console.log(eventData)
    this.eventService.updateEvent(eventData).subscribe({
      next: (updatedEvent) => {
        this.showSuccess('Event updated successfully');
        this.loadEvents();
      },
      error: (error) => {
        // this.showError('Failed to update event');
        this.showError(error.error?.error.message);
      }
    });
  }

  deleteEvent(event: any) {
    if (confirm('Are you sure you want to delete this event?')) {
      this.eventService.deleteEvent(event._id).subscribe({
        next: () => {
          this.showSuccess('Event deleted successfully');
          this.loadEvents();
        },
        error: (error) => {
          this.showError(error.error?.error.message);
        }
      });
    }
  }
  canManageEvent(event: any): boolean {
    // return this.isAdmin || event.createdBy === this.userId;
    return true;
  }
  
  private showSuccess(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['success-snackbar']
    });
  }

  private showError(message: string) {
    this.snackBar.open(message, 'Close', {
      duration: 5000,
      verticalPosition: 'top',
      panelClass: ['error-snackbar']
    });
  }
}
