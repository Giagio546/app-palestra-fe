import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpModel } from '../models/SignUpModel';
import { SignupService } from '../signup.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.sass']
})
export class SignUpComponent {
  registrationForm: FormGroup;
  erroreRegistrazione: Boolean = false;
  constructor(private fb: FormBuilder, private signupService: SignupService, private router: Router) {
    this.registrationForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      confirmPassword: ['', [Validators.required, this.matchPassword.bind(this)]],
      nome: ['', Validators.required],
      cognome: ['', Validators.required],
      dataNascita: ['', Validators.required],
      numeroDiTelefono: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    
  }

  matchPassword(control: AbstractControl): { [key: string]: boolean } | null {
    const passwordControl = this.registrationForm?.get('password');
    if (!passwordControl) {
      return null;
    }
    const password = this.registrationForm.get('password')?.value;
    const confirmPassword = control.value;
    return password === confirmPassword ? null : { 'mismatch': true };
  }

  onSubmit(): void {
    if(this.registrationForm.valid) {
      console.log(this.registrationForm)
      const formData: SignUpModel = this.registrationForm.value
      this.signupService.signUp(formData).subscribe({
        next: (v) => {
          this.router.navigate(['home']);
        },
        error: (e) => {
          this.erroreRegistrazione = true;
          throw new Error(e);
        }
      });
    }
  };
}
