import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSonnerToaster } from 'ngx-sonner';
import { HeaderComponent } from './shared/header/header.component';
import { UserService } from './shared/data-access/user.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSonnerToaster, HeaderComponent],
  template: `<app-header></app-header>
    <router-outlet></router-outlet>
    <ngx-sonner-toaster
      visibleToasts="5"
      [toastOptions]="{
        duration: 3000,
        unstyled: true,
        classes: {
          toast:
            'flex justify-center gap-2 items-center py-4 px-6 rounded-sm font-proxima text-base shadow-lg',
          error: 'bg-pink text-navy',
          success: 'bg-primary text-white',
          info: 'bg-grey-light',
          warning: 'bg-yellow'
        }
      }"
    />`,
})
export class AppComponent {
  constructor(private userService: UserService) {
    this.userService.initializeUser();
  }
}
