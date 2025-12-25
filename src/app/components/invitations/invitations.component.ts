import { Component, OnInit } from '@angular/core';
import { EventsService } from '../../services/event';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './invitations.html',
  styleUrls: ['./invitations.css']
})
export class InvitationsComponent implements OnInit {
  invitations: any[] = [];
  loading = false;

  constructor(
    private eventService: EventsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadInvitations();
  }

  loadInvitations() {
    this.loading = true;
    this.eventService.getMyInvitations().subscribe({
      next: (response) => {
        this.invitations = response.invitations || response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading invitations:', error);
        this.loading = false;
      }
    });
  }

  respondToInvitation(eventId: number, status: string) {
    this.eventService.respondToInvitation(eventId, status).subscribe({
      next: (response) => {
        // Update local state
        const invitation = this.invitations.find(inv => inv.id === eventId || inv.event_id === eventId);
        if (invitation) {
          invitation.status = status;
        }
        alert(`Response recorded: ${this.getStatusText(status)}`);
        this.loadInvitations(); // Reload to get updated data
      },
      error: (error) => {
        console.error('Error updating status:', error);
        alert('Failed to update attendance status');
      }
    });
  }

  viewEventDetails(eventId: number) {
    this.router.navigate(['/events', eventId]);
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'going': return 'badge-success';
      case 'maybe': return 'badge-warning';
      case 'not going': 
      case 'not_going': return 'badge-danger';
      case 'pending': return 'badge-secondary';
      default: return 'badge-secondary';
    }
  }

  getStatusText(status: string): string {
    switch(status) {
      case 'going': return 'Going';
      case 'maybe': return 'Maybe';
      case 'not going':
      case 'not_going': return 'Not Going';
      case 'pending': return 'Pending Response';
      default: return status;
    }
  }

  getPendingCount(): number {
    return this.invitations.filter(inv => inv.status === 'pending' || !inv.status).length;
  }
}