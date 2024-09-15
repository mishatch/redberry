import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {Estate} from "../../../shared/models/estate.model";

@Injectable({
  providedIn: 'root'
})
export class RealEstateService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';
  private token = '9cfc4818-c76a-4078-8526-47bc0b22f1e0';

  constructor(private http: HttpClient) { }

  getEstates(): Observable<Estate[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<Estate[]>(`${this.apiUrl}/real-estates`, {headers});
  }
  getEstateById(id: number | string | null): Observable<Estate>{
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get<Estate>(`${this.apiUrl}/real-estates/${id}`, {headers});
  }
  deleteEstate(id: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.delete(`${this.apiUrl}/real-estates/${id}`, {headers});
  }
}
