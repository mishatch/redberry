import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';
  private token = '9cfc4818-c76a-4078-8526-47bc0b22f1e0';

  constructor(private http: HttpClient) { }

  getAgents() {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });

    return this.http.get(`${this.apiUrl}/agents`, {headers});
  }
}
