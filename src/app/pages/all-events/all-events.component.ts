import { Component, inject, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { EventService } from '../../services/event.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-all-events',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule, // Add this module
    MatSnackBarModule,   // Add this module
    MatMenuModule  
  ],
  templateUrl: './all-events.component.html',
  styleUrl: './all-events.component.scss'
})
export class AllEventsComponent implements AfterViewInit {
  dataSource: MatTableDataSource<any>;
  displayedColumns = ['title', 'creator', 'date', 'location', 'participants', 'status', 'actions'];
  isLoading = false;
  totalEvents = 0;
  pageSize = 10;
  currentPage = 0;

  filterForm: FormGroup;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private eventService: EventService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<any>([]);
    this.filterForm = this.fb.group({
      search: [''],
      status: [''],
      location: [''],
      startDate: [null],
      endDate: [null]
    });
    // Subscribe to filter changes
    this.filterForm.valueChanges.subscribe(() => {
      this.loadEvents();
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.loadEvents();
  }
  loadEvents() {
    this.isLoading = true;
    const filters = this.filterForm.value;
    
    this.eventService.getAdminEvents(
      this.currentPage + 1,
      this.pageSize,
      filters
    ).subscribe({
      next: (data) => {
        this.dataSource.data = data.events;
        this.totalEvents = data.totalEvents;
        this.isLoading = false;
      },
      error: (error) => {
        this.snackBar.open('Error loading events', 'Close', { duration: 3000 });
        this.isLoading = false;
      }
    });
  }

  resetFilters() {
    this.filterForm.reset();
    this.loadEvents();
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadEvents();
  }

  viewParticipants(event: any) {
    // Implement view participants dialog
  }

  approveEvent(event: any) {
    // Implement approve event functionality
  }

  deleteEvent(event: any) {
    // Implement delete event functionality
  }
}
