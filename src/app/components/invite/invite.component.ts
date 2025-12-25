import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EventsService } from '../../services/event';

@Component({
  selector: 'app-invite',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './invite.html',
  styleUrls: ['./invite.css']
})
export class InviteComponent {

  eventId!: number;
  email: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService
  ) {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
  }

  sendInvite() {
    if (!this.email.trim()) {
      alert("Email is required!");
      return;
    }

    this.eventsService.inviteAttendee(this.eventId, { email: this.email })
      .subscribe({
        next: (res) => {
          alert("Invitation sent!");
          this.router.navigate(['/events']);
        },
        error: (err) => alert(err.error.message || "Error sending invite")
      });
  }
}
