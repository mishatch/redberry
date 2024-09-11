import { Component } from '@angular/core';
import {FilterComponent} from "./components/filter/filter.component";
import {ApartmentsComponent} from "./components/apartments/apartments.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FilterComponent,
    ApartmentsComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
