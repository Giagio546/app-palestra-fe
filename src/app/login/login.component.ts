import { Component } from '@angular/core';
import { LoginModalService } from '../login-modal.service';
import { AuthService } from '../auth.service';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent {
  private authSubscription: Subscription | undefined;
  email: string = '';
  password: string = '';
  utenteNonAbilitato: Boolean = false;
  constructor(private loginModalService: LoginModalService, private authService: AuthService){}

  closeModal(): void {
    this.loginModalService.closeModal();
  }
  stopPropagation(event: Event): void {
    event.stopPropagation();
  }

  submitForm(form: NgForm): void {
    if (form.valid) {
      this.authService.login(this.email, this.password).subscribe({
        next: (v) => {
          this.authService.isAuthenticated = true;
        },
        error: (e: HttpErrorResponse) => {
          console.error("Errore durante il login:", e);
          if (e.status === 403) {
            this.utenteNonAbilitato = true;
          } else {
            console.log(e)
          }
        }
      });
      this.authSubscription = this.authService.isAuthenticated$.subscribe(isAuthenticated => {
        if (isAuthenticated) {
          this.closeModal();
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
