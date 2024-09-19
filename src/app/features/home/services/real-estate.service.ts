import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Estate } from "../../../shared/models/estate.model";

@Injectable({
  providedIn: 'root'
})
export class RealEstateService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';

  constructor(private http: HttpClient) { }

  public getEstates(): Observable<Estate[]> {
    return this.http.get<Estate[]>(`${this.apiUrl}/real-estates`);
  }

  public getEstateById(id: number | string | null): Observable<Estate> {
    return this.http.get<Estate>(`${this.apiUrl}/real-estates/${id}`);
  }

  public deleteEstate(id: any) {
    return this.http.delete(`${this.apiUrl}/real-estates/${id}`);
  }
}
