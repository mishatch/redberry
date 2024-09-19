import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ListingService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';

  constructor(private http: HttpClient) { }

  public addListing(data: any) {
    return this.http.post(`${this.apiUrl}/real-estates`, data);
  }
}
