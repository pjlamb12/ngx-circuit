import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentsListComponent } from '@circuit-breaker/feature/environments';
import { ActivatedRoute } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ApplicationsService } from '@circuit-breaker/data-access/applications';
import { FlagsService } from '@circuit-breaker/data-access/flags';
import { Application, Flag } from '@circuit-breaker/shared/util/models';
import { switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'circuit-breaker-application-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, EnvironmentsListComponent],
  templateUrl: './application-detail.component.html',
})
export class ApplicationDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private applicationsService = inject(ApplicationsService);
  private flagsService = inject(FlagsService);
  private fb = inject(FormBuilder);

  application = signal<Application | null>(null);
  flags = signal<Flag[]>([]);
  isModalOpen = signal(false);
  isSubmitting = signal(false);
  editingFlag = signal<Flag | null>(null);

  currentTab = signal<'flags' | 'environments'>('flags');

  flagForm: FormGroup = this.fb.group({
    key: ['', Validators.required],
    description: [''],
    defaultValue: [false],
  });

  ngOnInit() {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (id) {
            return this.applicationsService.getApplication(id).pipe(
              tap((app) => {
                this.application.set(app);
                this.loadFlags(app.id);
              }),
            );
          }
          return of(null);
        }),
      )
      .subscribe();
  }

  loadFlags(applicationId: string) {
    this.flagsService.getFlags(applicationId).subscribe((flags) => {
      this.flags.set(flags);
    });
  }

  openCreateModal() {
    this.editingFlag.set(null);
    this.flagForm.reset({ defaultValue: false });
    this.isModalOpen.set(true);
  }

  openEditModal(flag: Flag) {
    this.editingFlag.set(flag);
    this.flagForm.patchValue({
      key: flag.key,
      description: flag.description,
      defaultValue: flag.defaultValue,
    });
    this.isModalOpen.set(true);
  }

  closeModal() {
    this.isModalOpen.set(false);
    this.editingFlag.set(null);
    this.flagForm.reset();
  }

  saveFlag() {
    const app = this.application();
    if (this.flagForm.invalid || !app) return;

    this.isSubmitting.set(true);
    const formValue = this.flagForm.value;
    const appId = app.id;

    const editingFlag = this.editingFlag();
    if (editingFlag) {
      const id = editingFlag.id;
      this.flagsService.updateFlag(id, formValue).subscribe({
        next: () => {
          this.loadFlags(appId);
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: () => this.isSubmitting.set(false),
      });
    } else {
      this.flagsService
        .createFlag({ ...formValue, applicationId: appId })
        .subscribe({
          next: () => {
            this.loadFlags(appId);
            this.closeModal();
            this.isSubmitting.set(false);
          },
          error: () => this.isSubmitting.set(false),
        });
    }
  }

  deleteFlag(id: string) {
    const app = this.application();
    if (app && confirm('Are you sure you want to delete this flag?')) {
      const appId = app.id;
      this.flagsService.deleteFlag(id).subscribe(() => {
        this.loadFlags(appId);
      });
    }
  }
}
