import { Component } from '@angular/core';
import {FilterComponent} from "./components/filter/filter.component";
import {RealEstatesComponent} from "./components/real-estates/real-estates.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FilterComponent,
    RealEstatesComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
