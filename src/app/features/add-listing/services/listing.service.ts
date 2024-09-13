import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';
  private token = '9cfc4818-c76a-4078-8526-47bc0b22f1e0';

  constructor(private http: HttpClient) { }

  addListing(data: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
    return this.http.post(`${this.apiUrl}/real-estates`, data, {headers});
  }
}
