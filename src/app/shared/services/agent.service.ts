import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {Agent} from "../models/agent.model";

@Injectable({
  providedIn: 'root'
})
export class AgentService {
  private apiUrl = 'https://api.real-estate-manager.redberryinternship.ge/api';

  constructor(private http: HttpClient) { }

  getAgents(): Observable<Agent[]> {
    return this.http.get<Agent[]>(`${this.apiUrl}/agents`);
  }

  addAgent(agent: any) {
    return this.http.post(`${this.apiUrl}/agents`, agent);
  }
}
