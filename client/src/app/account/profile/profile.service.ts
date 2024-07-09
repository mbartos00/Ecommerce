import { Injectable } from '@angular/core';

import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Profile } from '@app/shared/types/profile';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  constructor(private http: HttpClient) {}

  getProfile(): Observable<Profile> {
    return this.http
      .get<{
        status: string;
        data: Profile;
      }>(environment.API_URL + '/user')
      .pipe(map(response => response.data));
  }

  updateUser(data: Profile | Partial<Profile>): Observable<Profile> {
    return this.http.patch<Profile>(environment.API_URL + '/user/update', data);
  }

  changeEmail(email: string): Observable<void> {
    return this.http.post<void>(environment.API_URL + '/user/email/change', {
      email,
    });
  }

  verifyEmail(token: string): Observable<{ email: string }> {
    return this.http
      .get<{ status: string; data: { email: string } }>(
        environment.API_URL + '/user/email/verify',
        {
          params: { token },
        }
      )
      .pipe(map(d => d.data));
  }
}
