import { Component } from '@angular/core';
import { LoginModalService } from './login-modal.service';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  isAuthenticated: boolean = false;
  title = 'app-palestra-fe';
  constructor(private loginModalService: LoginModalService, private authService: AuthService) {
    this.authService.isAuthenticated$.subscribe(isAuthenticated => {
      this.isAuthenticated = isAuthenticated;
    });
   }

  openModal(): void {
    this.loginModalService.openModal();
  }

}
