import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../../services/event';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  allEvents: any[] = [];
  filteredEvents: any[] = [];
  invitations: any[] = [];
  pendingCount: number = 0;
  searchKeyword: string = '';

  constructor(
    private eventService: EventsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadEvents();
    this.loadInvitations();
  }

  loadEvents() {
    this.eventService.getMyEvents().subscribe({
      next: (res: any) => {
        this.allEvents = res;
        this.filteredEvents = res; // Initialize filtered events
      },
      error: (err: any) => console.error('Error loading events:', err)
    });
  }

  loadInvitations() {
    this.eventService.getMyInvitations().subscribe({
      next: (response: any) => {
        this.invitations = response.invitations || response;
        this.pendingCount = this.invitations.filter(
          inv => inv.status === 'pending' || !inv.status
        ).length;
      },
      error: (err: any) => console.error('Error loading invitations:', err)
    });
  }

  quickSearch() {
    if (!this.searchKeyword.trim()) {
      this.filteredEvents = this.allEvents; // Show all events if search is empty
      return;
    }

    const keyword = this.searchKeyword.toLowerCase();
    this.filteredEvents = this.allEvents.filter(event => 
      event.title?.toLowerCase().includes(keyword) ||
      event.description?.toLowerCase().includes(keyword) ||
      event.location?.toLowerCase().includes(keyword)
    );
  }

  goToCreateEvent() {
    this.router.navigate(['/create-event']);
  }

  goToInvitations() {
    this.router.navigate(['/invitations']);
  }

  viewEvent(eventId: number) {
    this.router.navigate(['/events', eventId]);
  }
}