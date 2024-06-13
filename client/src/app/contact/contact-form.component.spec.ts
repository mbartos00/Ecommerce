import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ContactFormComponent } from './contact-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ContactFormComponent,
        HttpClientTestingModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should mark email field as invalid when empty', () => {
    const emailControl = component.contactForm.get('email');
    emailControl?.setValue('');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['required']).toBeTruthy();
  });

  it('should mark email field as invalid when email is invalid', () => {
    const emailControl = component.contactForm.get('email');
    emailControl?.setValue('invalid-email');
    expect(emailControl?.valid).toBeFalsy();
    expect(emailControl?.errors?.['email']).toBeTruthy();
  });

  it('should mark name field as invalid when empty', () => {
    const nameControl = component.contactForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalsy();
    expect(nameControl?.errors?.['required']).toBeTruthy();
  });

  it('should mark message field as invalid when empty', () => {
    const messageControl = component.contactForm.get('message');
    messageControl?.setValue('');
    expect(messageControl?.valid).toBeFalsy();
    expect(messageControl?.errors?.['required']).toBeTruthy();
  });

  it('should mark message field as invalid when message exceeds max length', () => {
    const messageControl = component.contactForm.get('message');
    messageControl?.setValue('a'.repeat(201));
    expect(messageControl?.valid).toBeFalsy();
    expect(messageControl?.errors?.['maxlength']).toBeTruthy();
  });
});
