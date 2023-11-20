import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CookieService } from 'ngx-cookie';
import {LoginResponse} from './models/LoginResponse'
import { JwtHelperService } from '@auth0/angular-jwt';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly jwtHelper = new JwtHelperService();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  constructor(private httpClient: HttpClient, private cookieService: CookieService) { }

  get isAuthenticated$(): Observable<boolean> {
    return this.isAuthenticatedSubject.asObservable();
  }

  login(email: string, password: string): Observable<LoginResponse> {
    console.log("chiamato login")
    const body = {
      email: email,
      password: password
    }
    return this.httpClient.post<LoginResponse>(environment.apiUrl + "users/login", body, { withCredentials: true });
  }

  logout(): Observable<any> {
    const headers = {
      'Authorization': `Bearer ${this.getJwtToken()}`
    }
    return this.httpClient.post<any>(`${environment.apiUrl}users/logout`, {}, { headers, withCredentials: true });
  }

  get isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  set isAuthenticated(value) {
    this.isAuthenticatedSubject.next(value);
  }
  getJwtToken(): string {
    return this.cookieService.get('JWT_TOKEN') || "";
  }

  isTokenExpired(token?: string): boolean {
    if (!token) {
      token = this.getJwtToken();
    }
    return this.jwtHelper.isTokenExpired(token);
  }

  getDecodedToken(token?: string): any | null {
    if(!token) {
      token = this.getJwtToken();
    }

    if(token && !this.isTokenExpired(token)) {
      return this.jwtHelper.decodeToken(token);
    } else {
      return null;
    }
  }
}
