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
import {
  Application,
  Flag,
  CircuitType,
} from '@circuit-breaker/shared/util/models';
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

  CircuitType = CircuitType;
  flagTypes = Object.values(CircuitType);

  flagForm: FormGroup = this.fb.group({
    key: ['', Validators.required],
    description: [''],
    type: [CircuitType.Boolean, Validators.required],
    defaultValue: [false], // Acts as 'enabled' for boolean, or fallback for others
    // Dynamic controls will be added/managed based on type
    percentage: [50, [Validators.min(0), Validators.max(100)]],
    startDate: [''],
    endDate: [''],
    targetGroups: [''],
    targetEnvironments: [''],
    targetDevices: [''],
    compositeRules: [''], // JSON string for now
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
    this.flagForm.reset({
      type: CircuitType.Boolean,
      defaultValue: false,
      percentage: 50,
    });
    this.isModalOpen.set(true);
  }

  openEditModal(flag: Flag) {
    this.editingFlag.set(flag);
    const config = flag.controlValue as any; // Type assertion for simplification

    this.flagForm.patchValue({
      key: flag.key,
      description: flag.description,
      type: flag.type || CircuitType.Boolean,
      defaultValue: flag.defaultValue,
      percentage: config?.percentage ?? 50,
      startDate: config?.startDate ?? '',
      endDate: config?.endDate ?? '',
      targetGroups: config?.groups ? config.groups.join(', ') : '',
      targetEnvironments: config?.environments
        ? config.environments.join(', ')
        : '',
      targetDevices: config?.devices ? config.devices.join(', ') : '',
      compositeRules: config?.conditions
        ? JSON.stringify(config.conditions, null, 2)
        : '',
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

    // Construct the payload based on type
    const payload: Partial<Flag> = {
      key: formValue.key,
      description: formValue.description,
      type: formValue.type,
      defaultValue: formValue.defaultValue,
      applicationId: appId,
    };

    if (formValue.type === CircuitType.Percentage) {
      payload.controlValue = {
        type: CircuitType.Percentage,
        percentage: formValue.percentage,
      };
    } else if (formValue.type === CircuitType.TimeBased) {
      payload.controlValue = {
        type: CircuitType.TimeBased,
        startDate: formValue.startDate,
        endDate: formValue.endDate || undefined,
      };
    } else if (formValue.type === CircuitType.Group) {
      payload.controlValue = {
        type: CircuitType.Group,
        groups: formValue.targetGroups
          .split(',')
          .map((g: string) => g.trim())
          .filter((g: string) => g),
      };
    } else if (formValue.type === CircuitType.Environment) {
      payload.controlValue = {
        type: CircuitType.Environment,
        environments: formValue.targetEnvironments
          .split(',')
          .map((e: string) => e.trim())
          .filter((e: string) => e),
      };
    } else if (formValue.type === CircuitType.Device) {
      payload.controlValue = {
        type: CircuitType.Device,
        devices: formValue.targetDevices
          .split(',')
          .map((d: string) => d.trim())
          .filter((d: string) => d),
      };
    } else if (formValue.type === CircuitType.Composite) {
      try {
        const conditions = JSON.parse(formValue.compositeRules || '[]');
        payload.controlValue = {
          type: CircuitType.Composite,
          conditions,
        };
      } catch (e) {
        alert('Invalid JSON for Composite Rules');
        this.isSubmitting.set(false);
        return;
      }
    }

    const editingFlag = this.editingFlag();
    if (editingFlag) {
      const id = editingFlag.id;
      this.flagsService.updateFlag(id, payload).subscribe({
        next: () => {
          this.loadFlags(appId);
          this.closeModal();
          this.isSubmitting.set(false);
        },
        error: () => this.isSubmitting.set(false),
      });
    } else {
      this.flagsService.createFlag(payload as any).subscribe({
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
