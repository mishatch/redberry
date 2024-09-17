import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {City, Region} from "../../features/add-listing/models/geographic.models";

@Injectable({
  providedIn: 'root'
})
export class GeographicInfoService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';
  private token = '9cfc4818-c76a-4078-8526-47bc0b22f1e0';

  constructor(private http: HttpClient) { }

  getRegions(): Observable<Region[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<Region[]>(`${this.apiUrl}/regions`, {headers});
  }
  getCities(): Observable<City[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<City[]>(`${this.apiUrl}/cities`, {headers});
  }
}
