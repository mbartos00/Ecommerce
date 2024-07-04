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
}
