import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { Address } from '@app/shared/types/address';

@Injectable({
  providedIn: 'root',
})
export class AddressService {
  constructor(private http: HttpClient) {}

  getAddresses(): Observable<Address[]> {
    return this.http
      .get<{
        status: string;
        data: Address[];
      }>(environment.API_URL + '/user/addresses')
      .pipe(map(response => response.data));
  }

  getAddress(addressId: string): Observable<Address> {
    return this.http
      .get<{
        status: string;
        data: Address;
      }>(`${environment.API_URL}/user/addresses/${addressId}`)
      .pipe(map(response => response.data));
  }

  addAddress(address: Partial<Address>): Observable<Address> {
    return this.http
      .post<{
        status: string;
        data: Address;
      }>(environment.API_URL + '/user/addresses', address)
      .pipe(map(response => response.data));
  }

  updateAddress(
    address: Partial<Address>,
    addressId: string
  ): Observable<Address> {
    return this.http
      .patch<{
        status: string;
        data: Address;
      }>(`${environment.API_URL}/user/addresses/${addressId}`, address)
      .pipe(map(response => response.data));
  }

  deleteAddress(addressId: string): Observable<Address> {
    return this.http
      .delete<{
        status: string;
        data: Address;
      }>(`${environment.API_URL}/user/addresses/${addressId}`)
      .pipe(map(response => response.data));
  }
}
