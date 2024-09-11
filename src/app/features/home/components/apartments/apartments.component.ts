import { Component } from '@angular/core';
import {RealEstateService} from "../../services/real-estate.service";

@Component({
  selector: 'app-apartments',
  standalone: true,
  imports: [],
  templateUrl: './apartments.component.html',
  styleUrl: './apartments.component.scss'
})
export class ApartmentsComponent {
  constructor(private estateService: RealEstateService) {
    this.estateService.getEstates().subscribe(
      (data) => {
        console.log(data);
      },
      (error) => {
        console.error(error);
      }
    );
  }
}
