import { Component, OnInit, ViewChild } from '@angular/core';
import { EventService } from '../../services/event.service';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DatePipe } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-pending-events',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressBarModule,
    MatInputModule,
    MatFormFieldModule,
    DatePipe
  ],
  templateUrl: './pending-events.component.html',
  styleUrl: './pending-events.component.scss'
})
export class PendingEventsComponent implements OnInit {

  dataSource: MatTableDataSource<Event>;
  displayedColumns = ['title', 'date', 'location', 'participants', 'status', 'actions'];
  isLoading = false;
  totalEvents = 0;
  pageSize = 10;
  currentPage = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  constructor(
    private eventService: EventService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
  }

  ngOnInit() {
    this.loadPendingEvents();
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    
    // Custom sorting for date
    this.dataSource.sortingDataAccessor = (item: any, property) => {
      switch(property) {
        case 'date': return new Date(item.date);
        default: return item[property];
      }
    };

    // Custom filtering
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const searchStr = (data.title + data.location + data.status).toLowerCase();
      return searchStr.indexOf(filter.toLowerCase()) !== -1;
    };
  }
  loadPendingEvents() {
    this.isLoading = true;
    this.eventService.getPendingEvents(this.currentPage + 1, this.pageSize)
      .subscribe({
        next: (data) => {
          this.dataSource.data = data.events;
          this.totalEvents = data.totalEvents;
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open('Error loading pending events', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPendingEvents();
  }

  applyFilter(event: any) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ApproveEvent(event: any, status: string) {
    this.isLoading = true;
    this.eventService.ApproveEvent(event._id,status)
      .subscribe({
        next: (data) => {
          this.snackBar.open(`Event ${status} successfully`, 'Close',
            { duration: 3000 ,
             verticalPosition: 'top',
              panelClass: ['success-snackbar']
            });
          this.loadPendingEvents();
          this.isLoading = false;
        },
        error: (error) => {
          this.snackBar.open(error.error?.error.message, 'Close',
             { duration: 3000 ,
              verticalPosition: 'top',
               panelClass: ['error-snackbar']
             });
          this.isLoading = false;
        }
      });
  }

  rejectEvent(event: any) {
    this.isLoading = true;
    this.eventService.getPendingEvents(this.currentPage + 1, this.pageSize)
      .subscribe({
        next: (data) => {
          this.loadPendingEvents();
        },
        error: (error) => {
          this.snackBar.open('Error loading pending events', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      });
  }
}
