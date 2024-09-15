import {Component, OnDestroy, OnInit} from '@angular/core';
import {RealEstateService} from "../../services/real-estate.service";
import {Router} from "@angular/router";
import {Estate} from "../../../../shared/models/estate.model";
import {Subscription} from "rxjs";
import {LoadingComponent} from "../../../../shared/components/loading/loading.component";

@Component({
  selector: 'app-real-estates',
  standalone: true,
  imports: [
    LoadingComponent
  ],
  templateUrl: './real-estates.component.html',
  styleUrl: './real-estates.component.scss'
})
export class RealEstatesComponent implements OnInit, OnDestroy {
  public realEstates: Estate[] = [];
  public isLoading: boolean = true;

  private subscription!: Subscription;

  constructor(private estateService: RealEstateService, private router: Router) {}

  ngOnInit() {
    this.getRealEstates();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  viewEstateDetails(estate: Estate) {
    this.router.navigate(['/real-estate', estate.id]);
  }
  private getRealEstates() {
    this.subscription = this.estateService.getEstates().subscribe(
      (data) => {
        this.realEstates = data;
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
}
