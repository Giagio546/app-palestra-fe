import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { PrenotazioniMeseModel } from './models/PrenotazioniMeseModel';

@Injectable({
  providedIn: 'root'
})
export class PrenotazioniService {

  constructor(private httpClient: HttpClient, private cookieService: CookieService, private authService: AuthService) { }

  getPrenotazioniInMonth(start: Date, end: Date): Observable<PrenotazioniMeseModel[]> {
    const token = this.authService.getJwtToken();
    const headers = {
      Authorization: "Bearer " + token
    }
    return this.httpClient.get<PrenotazioniMeseModel[]>(environment.apiUrl + "prenotazioni/mese/" + start + "/" + end, {headers});
  }

  addPrenotazione(date: Date): Observable<any> {
    const token = this.authService.getJwtToken();
    const headers = {
      Authorization: "Bearer " + token
    };
    const body = {
      user_id: this.authService.getDecodedToken(token).user.id,
      date
    };
    return this.httpClient.post<any>(environment.apiUrl + "prenotazioni/", body, {headers});
  }
}
