import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { EventsService } from '../../services/event';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [FormsModule, RouterModule, CommonModule],
  templateUrl: './events.html',
  styleUrls: ['./events.css']
})
export class EventsComponent {
  events: any[] = [];

  searchKeyword: string = '';

  title = '';
  description = '';
  location = '';
  start_datetime = '';
  end_datetime = '';

  editingId: number | null = null;

  constructor(private eventsService: EventsService, private router: Router) {
    this.loadEvents();
  }

  loadEvents() {
    this.eventsService.getMyEvents().subscribe({
      next: (res) => (this.events = res),
      error: (err) => console.log(err)
    });
  }

   goToSearch() {
    this.router.navigate(['/search'], {
      queryParams: { keyword: this.searchKeyword }
    });
  }

  saveEvent() {
    const data = {
      title: this.title,
      description: this.description,
      location: this.location,
      start_datetime: this.start_datetime,
      end_datetime: this.end_datetime
    };

    if (this.editingId !== null) {
      // UPDATE
      this.eventsService.updateEvent(this.editingId, data).subscribe({
        next: () => {
          this.loadEvents();
          this.clearForm();
        },
        error: (err) => console.log(err)
      });
    } else {
      // CREATE
      this.eventsService.createEvent(data).subscribe({
        next: () => {
          this.loadEvents();
          this.clearForm();
        },
        error: (err) => console.log(err)
      });
    }
  }

  editEvent(e: any) {
    this.editingId = e.id;
    this.title = e.title;
    this.description = e.description;
    this.location = e.location;

    // convert backend datetime → HTML datetime-local format
    this.start_datetime = e.start_datetime?.slice(0, 16);
    this.end_datetime = e.end_datetime?.slice(0, 16);
  }

  deleteEvent(id: number) {
    this.eventsService.deleteEvent(id).subscribe({
      next: () => this.loadEvents(),
      error: (err) => console.log(err)
    });
  }

  clearForm() {
    this.editingId = null;
    this.title = '';
    this.description = '';
    this.location = '';
    this.start_datetime = '';
    this.end_datetime = '';
  }

  goToAddTask(eventId: number) {
    this.router.navigate(['/tasks', eventId], { queryParams: { create: true } });
  }

// Navigate to view tasks
  goToViewTasks(eventId: number) {
    this.router.navigate(['/tasks', eventId]);
  }

  goToInvite(eventId: number) {
    this.router.navigate(['/events', eventId, 'invite']);
  }

}
