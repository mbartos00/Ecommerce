import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HlmButtonDirective } from '@app/shared/ui/ui-button-helm/src';
import { HlmInputDirective } from '@app/shared/ui/ui-input-helm/src';
import { FormInputComponent } from '@app/shared/ui/form-input/form-input.component';
import { FormTextareaComponent } from '@app/shared/ui/form-textarea/form-textarea.component';
import { ContactService } from './data-access/contact.service';
import { toast } from 'ngx-sonner';
import { ContactFormSchema } from '@app/shared/types/schemas';
import {
  ReactiveFormsModule,
  Validators,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [
    HlmButtonDirective,
    HlmInputDirective,
    ReactiveFormsModule,
    CommonModule,
    RouterModule,
    FormInputComponent,
    FormTextareaComponent,
    HlmInputDirective,
  ],
  providers: [ContactService],
  templateUrl: './contact-form.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactFormComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private contact: ContactService
  ) {}

  ngOnInit(): void {
    this.contactForm = this.fb.nonNullable.group(
      {
        email: ['', [Validators.required, Validators.email]],
        name: ['', [Validators.required]],
        message: ['', [Validators.required, Validators.maxLength(200)]],
      },
      {
        updateOn: 'blur',
      }
    );
  }

  onSubmit(contactForm: ContactFormSchema): void {
    if (this.contactForm.invalid) return;
    this.contact.postMessage(contactForm).subscribe({
      next: response => {
        toast.success('Message sent successfully!');
        this.contactForm.reset();
      },
      error: error => {
        console.error('Error sending message', error);
        toast.error('Error sending message. Please try again later.');
      },
    });
  }
}
