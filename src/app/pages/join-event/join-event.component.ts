import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../services/event.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-join-event',
  imports: [MatCardModule, MatButtonModule, DatePipe],
  templateUrl: './join-event.component.html',
  styleUrl: './join-event.component.scss'
})
export class JoinEventComponent implements OnInit  {
  event: any;
  isJoined = false;
  isFull = false;
  constructor(
    private route:  ActivatedRoute,
    private router:Router,
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {}
  ngOnInit() {
    const eventId = this.route.snapshot.params['id'];
    this.loadEventDetails(eventId);
  }

  loadEventDetails(eventId: string) {
    this.eventService.getEventById(eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.isFull = event.participants.length >= event.maxParticipants;
      },
      error: (error) => {
        this.snackBar.open('Error loading event details', 'Close', {
          duration: 3000
        });
        this.router.navigate(['/events']);
      }
    });
  }
  joinEvent() {
    if (this.isJoined || this.isFull) return;

    this.eventService.joinEvent(this.event.id).subscribe({
      next: () => {
        this.snackBar.open('Successfully joined the event!', 'Close', {
          duration: 3000
        });
        this.isJoined = true;
        this.loadEventDetails(this.event.id);
      },
      error: (error) => {
        this.snackBar.open('Error joining event', 'Close', {
          duration: 3000
        });
      }
    });
  }

  getButtonText(): string {
    if (this.isJoined) return 'Already Joined';
    if (this.isFull) return 'Event Full';
    return 'Join Event';
  }

  goBack() {
    this.router.navigate(['/events']);
  }
  private checkIfJoined(): boolean {
    // Implement logic to check if current user is in participants
    return false;
  }
}
