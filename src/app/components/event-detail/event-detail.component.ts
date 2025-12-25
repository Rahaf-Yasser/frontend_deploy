import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from '../../services/event';
import { AttendeeService } from '../../services/attendee';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './event-detail.html',
  styleUrls: ['./event-detail.css']
})
export class EventDetailComponent implements OnInit {

  event: any = null;
  attendees: any[] = [];
  tasks: any[] = [];
  isOrganizer = false;
  myAttendeeRecord: any = null;
  myStatus = "";
  loading = true;
  editMode = false;

  inviteEmail = '';
  inviteRole = 'attendee';

  newTaskDescription = '';
  newTaskAssigneeId: any = '';

  // Edit event data
  editData: any = {
    title: '',
    date: '',
    time: '',
    location: '',
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventsService,
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.router.navigate(['/dashboard']);
      return;
    }
    this.loadEvent(id);
    this.loadAttendees(id);
    this.loadTasks(id);
  }

  loadEvent(id: number) {
    this.eventService.getEvent(id).subscribe({
      next: (res) => {
        this.event = res;
        this.loading = false;
        this.prepareEditData();
      },
      error: () => {
        alert("Event not found");
        this.router.navigate(['/dashboard']);
      }
    });
  }

  loadAttendees(id: number) {
    console.log('=== LOADING ATTENDEES ===');
    console.log('Event ID:', id);
    
    this.eventService.getEventAttendees(id).subscribe({
      next: (res) => {
        console.log('Raw attendees response:', res);
        
        this.attendees = res.attendees || res;
        console.log('Parsed attendees array:', this.attendees);
        
        const myId = Number(localStorage.getItem("userId"));
        console.log('My user ID from localStorage:', myId);
        console.log('Type of myId:', typeof myId);
        
        // Try to find my record
        this.myAttendeeRecord = this.attendees.find((a: any) => {
          console.log(`Comparing: a.user_id (${a.user_id}, ${typeof a.user_id}) === myId (${myId}, ${typeof myId})`);
          return Number(a.user_id) === myId;
        });
        
        console.log('My attendee record found:', this.myAttendeeRecord);
        
        if (this.myAttendeeRecord) {
          this.isOrganizer = this.myAttendeeRecord.role === "organizer";
          console.log('Role from record:', this.myAttendeeRecord.role);
          console.log('IS ORGANIZER:', this.isOrganizer);
          this.myStatus = this.myAttendeeRecord.status || "pending";
        } else {
          console.warn('⚠️ MY ATTENDEE RECORD NOT FOUND!');
          console.log('Available user_ids in attendees:', this.attendees.map((a: any) => a.user_id));
        }
      },
      error: (err) => {
        console.error('❌ Error loading attendees:', err);
      }
    });
  }

  loadTasks(eventId: number) {
    console.log('Attempting to load tasks for event:', eventId);
    
    this.eventService.getTasks(eventId).subscribe({
      next: (res: any) => {
        console.log('Tasks response:', res);
        this.tasks = (res.tasks || res || []).map((task: any) => ({
          ...task,
          id: task.task_id || task.id  // ← Normalize the ID field
        }));
        console.log('Tasks loaded:', this.tasks);
      },
      error: (err: any) => {
        console.error('Error loading tasks:', err);
        this.tasks = [];
      }
    });
  }

  prepareEditData() {
    if (!this.event) return;
    
    const datetime = new Date(this.event.start_datetime);

    this.editData = {
      title: this.event.title,
      date: this.formatDate(datetime),
      time: this.formatTime(datetime),
      location: this.event.location,
      description: this.event.description || ''
    };
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatTime(date: Date): string {
    return date.toTimeString().split(':').slice(0, 2).join(':');
  }

  toggleEditMode() {
    this.editMode = !this.editMode;
    if (this.editMode) {
      this.prepareEditData();
    }
  }

  saveEvent() {
    const datetime = `${this.editData.date}T${this.editData.time}`;

    const updateData = {
      title: this.editData.title,
      start_datetime: datetime,
      end_datetime: datetime,
      location: this.editData.location,
      description: this.editData.description
    };

    this.eventService.updateEvent(this.event.id, updateData).subscribe({
      next: () => {
        alert('Event updated successfully!');
        this.editMode = false;
        this.loadEvent(this.event.id);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update event');
      }
    });
  }

  deleteEvent() {
    if (!confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      return;
    }

    this.eventService.deleteEvent(this.event.id).subscribe({
      next: () => {
        alert('Event deleted successfully!');
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete event');
      }
    });
  }

  sendInvite() {
    if (!this.inviteEmail.trim()) {
      alert("Please enter an email");
      return;
    }

    this.eventService.inviteAttendee(this.event.id, {
      email: this.inviteEmail,
      role: this.inviteRole
    }).subscribe({
      next: () => {
        alert("Invite sent!");
        this.inviteEmail = "";
        this.loadAttendees(this.event.id);
      },
      error: err => {
        console.error(err);
        alert("Error sending invite");
      }
    });
  }

  updateStatus() {
    if (!this.myStatus) {
      alert("Please select a status");
      return;
    }

    this.eventService.respondToInvitation(this.event.id, this.myStatus).subscribe({
      next: () => {
        alert("Status updated successfully!");
        this.loadAttendees(this.event.id);
      },
      error: (err) => {
        console.error(err);
        alert("Failed to update status");
      }
    });
  }

  addTask() {
    if (!this.newTaskDescription.trim()) {
      alert('Please enter a task description');
      return;
    }
  
    const taskData = {
      title: this.newTaskDescription,        // ← CHANGE from 'description'
      description: this.newTaskDescription,   // ← Keep this too
      due_date: new Date().toISOString().split('T')[0], // ← ADD THIS (today's date)
      assigned_to: this.newTaskAssigneeId || null
    };
  
    this.eventService.addTask(this.event.id, taskData).subscribe({
      next: () => {
        alert('Task added!');
        this.newTaskDescription = '';
        this.newTaskAssigneeId = '';
        this.loadTasks(this.event.id);
      },
      error: (err: any) => {
        console.error(err);
        alert('Failed to add task');
      }
    });
  }

  toggleTaskComplete(task: any) {
    const updateData = {
      completed: !task.completed
    };

    this.eventService.updateTask(this.event.id, task.id, updateData).subscribe({
      next: () => {
        this.loadTasks(this.event.id);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to update task');
      }
    });
  }

  startEditTask(task: any) {
    task.editing = true;
    task.editDescription = task.description;
    task.editAssigneeId = task.assigned_to || '';
  }

  saveTaskEdit(task: any) {
    if (!task.editDescription || !task.editDescription.trim()) {
      alert('Task description cannot be empty');
      return;
    }
  
    const updateData: any = {
      title: task.editDescription,
      description: task.editDescription
    };
  
    // Only include assigned_to if it has a value
    if (task.editAssigneeId) {
      updateData.assigned_to = task.editAssigneeId;
    }
  
    // Fix date format for MySQL (YYYY-MM-DD)
    if (task.due_date) {
      const date = new Date(task.due_date);
      updateData.due_date = date.toISOString().split('T')[0]; 
    }
  
    console.log('Updating task ID:', task.id);
    console.log('Update data:', updateData);
  
    this.eventService.updateTask(this.event.id, task.id, updateData).subscribe({
      next: () => {
        alert('Task updated!');
        task.editing = false;
        this.loadTasks(this.event.id);
      },
      error: (err: any) => {
        console.error('Update task error:', err);
        alert('Failed to update task');
      }
    });
  }

  cancelTaskEdit(task: any) {
    task.editing = false;
  }

  deleteTask(taskId: number) {
    if (!confirm('Delete this task?')) {
      return;
    }

    this.eventService.deleteTask(this.event.id, taskId).subscribe({
      next: () => {
        alert('Task deleted!');
        this.loadTasks(this.event.id);
      },
      error: (err) => {
        console.error(err);
        alert('Failed to delete task');
      }
    });
  }


  getStatusCount(status: string): number {
    return this.attendees.filter(a => {
      const attendeeStatus = a.status === 'not going' ? 'not_going' : a.status;
      const checkStatus = status === 'not going' ? 'not_going' : status;
      return attendeeStatus === checkStatus && a.role === 'attendee';
    }).length;
  }

  getStatusBadgeClass(status: string): string {
    switch(status) {
      case 'going': return 'badge-success';
      case 'maybe': return 'badge-warning';
      case 'not going':
      case 'not_going': return 'badge-danger';
      default: return 'badge-secondary';
    }
  }
  goBack() {
    this.router.navigate(['/dashboard']);
  }

  getMyUserId() {
    return localStorage.getItem("userId");
  }

  getAssigneeName(userId: number): string {
    const attendee = this.attendees.find(a => Number(a.user_id) === Number(userId));
    return attendee ? (attendee.name || attendee.email || attendee.user_email || `User #${userId}`) : 'Unassigned';
  }
  
}
