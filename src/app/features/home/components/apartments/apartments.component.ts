import { Component } from '@angular/core';
import {RealEstateService} from "../../services/real-estate.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-apartments',
  standalone: true,
  imports: [],
  templateUrl: './apartments.component.html',
  styleUrl: './apartments.component.scss'
})
export class ApartmentsComponent {
  realEstates: any;

  constructor(private estateService: RealEstateService, private router: Router) {
    this.estateService.getEstates().subscribe(
      (data) => {
        console.log(data);
        this.realEstates = data;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  viewEstateDetails(estate: any) {
    this.router.navigate(['/real-estate', estate.id], { state: { estate } });
  }
}
