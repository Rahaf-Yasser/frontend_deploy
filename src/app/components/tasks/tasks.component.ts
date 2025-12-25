import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../services/task';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './tasks.html',
  styleUrls: ['./tasks.css']
})
export class TasksComponent {
  eventId!: number;           // current event
  tasks: any[] = [];          // list of tasks

  // Form fields
  title = '';
  description = '';
  due_date = '';
  assigned_to!: number;

  editingTaskId: number | null = null;
  isCreating = true;

  constructor(
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.route.params.subscribe(params => {
      this.eventId = +params['eventId'];
      this.route.queryParams.subscribe(q => {
        this.isCreating = q['create'] === 'true';  // show form if query param exists
        this.loadTasks();
      });
    });
  }

  loadTasks() {
    this.taskService.getTasks(this.eventId).subscribe({
      next: (res: any) => {
        this.tasks = res;
        if (!this.isCreating && this.tasks.length === 0) {
          this.isCreating = true; // no tasks exist → show create form
        }
      },
      error: (err) => console.log(err)
    });
  }

  // Open create form
  goToCreateTask() {
    this.isCreating = true;
    this.clearForm();
  }

  // Create or update task
  saveTask() {
    const data = {
      title: this.title,
      description: this.description,
      due_date: this.due_date,
      assigned_to: this.assigned_to
    };

    if (this.editingTaskId !== null) {
      // UPDATE
      this.taskService.updateTask(this.editingTaskId, data).subscribe({
        next: () => {
          this.loadTasks();
          this.clearForm();
        },
        error: (err) => console.log(err)
      });
    } else {
      // CREATE
      this.taskService.addTask(this.eventId, data).subscribe({
        next: () => {
          this.loadTasks();
          this.clearForm();
        },
        error: (err) => console.log(err)
      });
    }
  }

  // Edit a task
  editTask(taskId: number) {
    const task = this.tasks.find(t => t.task_id === taskId);
    if (!task) return;

    this.editingTaskId = taskId;
    this.title = task.title;
    this.description = task.description;
    this.due_date = task.due_date?.slice(0, 10); // format for input[type=date]
    this.assigned_to = task.assigned_to;
    this.isCreating = true;
  }

  // Delete a task
  deleteTask(taskId: number) {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => this.loadTasks(),
      error: (err) => console.log(err)
    });
  }

  goToTasks() {
    this.router.navigate(['/tasks', this.eventId]);
  }

  goToEvents() {
    this.router.navigate(['/events']);
  }

  clearForm() {
    this.editingTaskId = null;
    this.title = '';
    this.description = '';
    this.due_date = '';
    this.assigned_to = 0;
  }
}
