import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { SignUpModel } from './models/SignUpModel';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SignupService {

  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  signUp(user: SignUpModel): Observable<any> {
    return this.httpClient.post<any>(environment.apiUrl + "users/", user);
  }
}
