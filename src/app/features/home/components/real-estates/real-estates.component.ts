import { Component, OnDestroy, OnInit } from '@angular/core';
import { RealEstateService } from "../../services/real-estate.service";
import { Router } from "@angular/router";
import { Estate } from "../../../../shared/models/estate.model";
import { Subscription } from "rxjs";
import { FilterService } from "../../../../shared/services/filter.service";
import { LoadingComponent } from "../../../../shared/components/loading/loading.component";
import {NumberSeparatorPipe} from "../../../../shared/pipes/number-separator.pipe";

@Component({
  selector: 'app-real-estates',
  standalone: true,
  imports: [
    LoadingComponent,
    NumberSeparatorPipe
  ],
  templateUrl: './real-estates.component.html',
  styleUrl: './real-estates.component.scss'
})
export class RealEstatesComponent implements OnInit, OnDestroy {

  public realEstates: Estate[] = [];
  public filteredRealEstates: Estate[] = [];
  public isLoading: boolean = true;

  private subscription!: Subscription;
  private filterSubscription!: Subscription;
  private filterCriteria: any;

  constructor(private estateService: RealEstateService, private filterService: FilterService, private router: Router) {}

  ngOnInit() {
    this.getRealEstates();

    this.filterSubscription = this.filterService.filterCriteria$.subscribe(criteria => {
      this.filterCriteria = criteria;
      this.applyFilters();
    });
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.filterSubscription) {
      this.filterSubscription.unsubscribe();
    }
  }

  public viewEstateDetails(estate: Estate) {
    this.router.navigate(['/real-estate', estate.id]);
  }

  private getRealEstates() {
    this.subscription = this.estateService.getEstates().subscribe(
      (data) => {
        this.realEstates = data;
        this.isLoading = false;
        this.applyFilters();
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  private applyFilters() {
    if (!this.filterCriteria || !this.realEstates) {
      return;
    }

    this.filteredRealEstates = this.realEstates.filter(estate => {
      const regionMatch = this.filterCriteria.regionIds.length === 0 || this.filterCriteria.regionIds.includes(estate.city.region_id);

      const priceMatch =
        (!this.filterCriteria.priceMin || estate.price >= this.filterCriteria.priceMin) &&
        (!this.filterCriteria.priceMax || estate.price <= this.filterCriteria.priceMax);

      const areaMatch =
        (!this.filterCriteria.areaMin || estate.area >= this.filterCriteria.areaMin) &&
        (!this.filterCriteria.areaMax || estate.area <= this.filterCriteria.areaMax);

      const bedroomsMatch =
        this.filterCriteria.bedrooms === null || estate.bedrooms === this.filterCriteria.bedrooms;

      return regionMatch && priceMatch && areaMatch && bedroomsMatch;
    });
  }
}
