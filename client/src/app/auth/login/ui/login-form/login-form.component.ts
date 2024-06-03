import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginSchema } from '@app/shared/types/schemas';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { LogoComponent } from '@app/shared/ui/logo/logo.component';
import { HlmButtonDirective } from '@app/shared/ui/ui-button-helm/src';
import { toast } from 'ngx-sonner';
import { LoginStatus } from '../../data-access/login.service';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterModule,
    HlmButtonDirective,
    LogoComponent,
    FormInputComponent,
  ],
  templateUrl: './login-form.component.html',
  styles: `
    :host {
      @apply px-1 w-full flex flex-col justify-center items-center mx-auto max-w-xs;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginFormComponent implements OnChanges {
  @Input({ required: true }) loginStatus!: LoginStatus;
  @Input() message?: string;
  @Output() login = new EventEmitter<LoginSchema>();

  private fb = inject(FormBuilder);

  loginForm = this.fb.nonNullable.group(
    {
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    },
    {
      updateOn: 'blur',
    }
  );

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.login.emit(this.loginForm.getRawValue());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['loginStatus']) {
      if (this.loginStatus === 'error' && this.message) {
        toast.error(this.message);
      }
    }
  }
}
