import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ContactFormSchema } from '@app/shared/types/schemas';
import { environment } from '@environments/environment.development';

@Injectable({ providedIn: 'root' })
export class ContactService {
  private api = `${environment.API_URL}/contact`;
  private defaultSubject = 'Message from E-comm';

  constructor(private http: HttpClient) {}

  postMessage(input: ContactFormSchema): Observable<string> {
    input.subject = this.defaultSubject;

    return this.http.post(this.api, input, { responseType: 'text' }).pipe(
      map(response => {
        if (response) {
          return response;
        } else {
          throw new Error('No response received');
        }
      }),
      catchError(error => {
        console.error('Error sending message', error);
        return throwError(() => new Error('Failed to send message'));
      })
    );
  }
}
