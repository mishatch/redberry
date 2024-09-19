import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {City, Region} from "../../features/add-listing/models/geographic.models";

@Injectable({
  providedIn: 'root'
})
export class GeographicInfoService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';

  constructor(private http: HttpClient) { }

  getRegions(): Observable<Region[]> {
    return this.http.get<Region[]>(`${this.apiUrl}/regions`);
  }
  getCities(): Observable<City[]> {
    return this.http.get<City[]>(`${this.apiUrl}/cities`);
  }
}
