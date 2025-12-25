import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { EventsService } from '../../services/event';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-event',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-event.html',
  styleUrls: ['./create-event.css']
})
export class CreateEventComponent {
  title = '';
  date = '';
  time = '';
  location = '';
  description = '';
  error = '';
  success = '';  // Add this

  constructor(
    private eventService: EventsService,
    private router: Router
  ) {}

  onCreate() {
    // Clear previous messages
    this.error = '';
    this.success = '';

    // Validation
    if (!this.title.trim()) {
      this.error = 'Please enter an event title';
      return;
    }

    if (!this.date) {
      this.error = 'Please select a date';
      return;
    }

    if (!this.time) {
      this.error = 'Please select a time';
      return;
    }

    if (!this.location.trim()) {
      this.error = 'Please enter a location';
      return;
    }

    // Combine date and time
    const startDatetime = `${this.date}T${this.time}`;

    const eventData = {
      title: this.title.trim(),
      start_datetime: startDatetime,
      end_datetime: startDatetime, // You can add end time if needed
      location: this.location.trim(),
      description: this.description.trim()
    };

    this.eventService.createEvent(eventData).subscribe({
      next: (response) => {
        this.success = 'Event created successfully!';
        
        // Redirect to dashboard after 1.5 seconds
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      error: (err) => {
        console.error('Error creating event:', err);
        this.error = err.error?.message || 'Failed to create event. Please try again.';
      }
    });
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}