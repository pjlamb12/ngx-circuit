import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ApplicationsService } from '@circuit-breaker/data-access/applications';
import { Application } from '@circuit-breaker/shared/util/models';

@Component({
  selector: 'lib-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  private applicationsService = inject(ApplicationsService);
  private fb = inject(FormBuilder);

  applications = signal<Application[]>([]);
  showCreateModal = signal(false);

  createForm = this.fb.group({
    name: ['', [Validators.required]],
    description: [''],
  });

  constructor() {
    this.loadApplications();
  }

  loadApplications() {
    this.applicationsService.getApplications().subscribe((apps) => {
      this.applications.set(apps);
    });
  }

  openCreateModal() {
    this.showCreateModal.set(true);
  }

  closeCreateModal() {
    this.showCreateModal.set(false);
    this.createForm.reset();
  }

  createApplication() {
    if (this.createForm.valid) {
      const { name, description } = this.createForm.value;
      if (name) {
        this.applicationsService
          .createApplication({ name, description: description || undefined })
          .subscribe(() => {
            this.loadApplications();
            this.closeCreateModal();
          });
      }
    }
  }

  deleteApplication(id: string) {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationsService.deleteApplication(id).subscribe(() => {
        this.loadApplications();
      });
    }
  }
}
