import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import * as FullCalendar from 'fullcalendar'
import { PrenotazioniService } from '../prenotazioni.service';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';
import itLocale from '@fullcalendar/core/locales/it';
@Component({
  selector: 'app-prenotazioni',
  templateUrl: './prenotazioni.component.html',
  styleUrls: ['./prenotazioni.component.sass'],
})
export class PrenotazioniComponent implements AfterViewInit {
  selectedEvents: Set<Date> = new Set();
  userId: any = this.authService.getDecodedToken(this.authService.getJwtToken()).user.id
  constructor( private el: ElementRef, private prenotazioniService: PrenotazioniService, private authService: AuthService ) {}
  calendarOptions: any = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    events: [],
  };

  ngAfterViewInit(): void {
    console.log(this.userId)
    const calendarEl = this.el.nativeElement.querySelector('#calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
      plugins: [dayGridPlugin],
      initialView: 'dayGridMonth',
      slotDuration: '01:30:00',
      events: [],
      locale: 'it',
      eventTimeFormat: {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      },
      datesSet: (info) => {
        calendar.removeAllEventSources();
        const events: FullCalendar.EventInput[] = [];
        const fasceOrarieComplete = environment.FASCE_ORARIE;
        console.log(info.end.toISOString());
        this.prenotazioniService.getPrenotazioniInMonth(info.start, info.end).subscribe({
          next: (v) => {
            v.forEach((giorno) => {
              const dataGiorno = giorno.giorno;
              fasceOrarieComplete.forEach((fasciaOraria) => {
                const prenotazioniFascia = giorno.fasceOrarie.find(
                  (fascia) => fascia.fasciaOraria === fasciaOraria
                );

                const startHour = fasciaOraria.split('-')[0];
                const endHour = fasciaOraria.split('-')[1];
                const startString = `${dataGiorno}T${startHour}:00.000Z`;
                const endString = `${dataGiorno}T${endHour}:00.000Z`;

                const start = new Date(startString);
                const end = new Date(endString);
                const backgroundColor =
                  prenotazioniFascia && prenotazioniFascia.prenotazioni.length >= environment.MAX_PRENOTAZIONI_FASCIA
                    ? 'red'
                    : 'green';
                const numeroPrenotazioni = prenotazioniFascia ? prenotazioniFascia.prenotazioni.length : 0;
                const utentePrenotato = prenotazioniFascia?.prenotazioni.find(prenotazione => (prenotazione.user_id == this.userId))
                const event: FullCalendar.EventInput = {
                  title: utentePrenotato ? `Posti liberi: ${environment.MAX_PRENOTAZIONI_FASCIA - numeroPrenotazioni}*` : `Posti liberi: ${environment.MAX_PRENOTAZIONI_FASCIA - numeroPrenotazioni}`,
                  start,
                  end,
                  backgroundColor,
                  extendedProps: { start, numeroPrenotazioni, utentePrenotato },
                };

                events.push(event);
              });
            });
            calendar.addEventSource(events);
          },
          error: (e) => {
            console.log(e);
          },
        });
      },
      eventClick: (info) => {
        const prenotazione = info.event.extendedProps['start'];
        const numeroPrenotazioni = info.event.extendedProps['numeroPrenotazioni'];
        console.log(info.event.extendedProps['utentePrenotato'])
        if(numeroPrenotazioni < environment.MAX_PRENOTAZIONI_FASCIA && prenotazione > Date.now()) {
          if(this.selectedEvents.has(prenotazione)) {
            this.selectedEvents.delete(prenotazione)
          }else if(info.event.extendedProps['utentePrenotato']) {
            
          } else {
            this.selectedEvents.add(prenotazione);
          }
        }
        console.log('Prenotazione cliccata:', prenotazione, numeroPrenotazioni);
      }
    });

    calendar.render();
  }

  inviaPrenotazione(date: Date) {
    this.prenotazioniService.addPrenotazione(date).subscribe({
      next: (v) => {
        this.selectedEvents.delete(date);
      },
      error: (e) => {}
    })
  }

  inviaPrenotazioni() {
    this.selectedEvents.forEach( event => {
      this.inviaPrenotazione(event);
    })
  }
}
