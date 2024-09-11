import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { GeographicInfoService } from './services/geographic-info.service';
import {NgFor} from "@angular/common";
import {City, Region} from "./models/geographic.models";
import {AgentService} from "../../shared/services/agent.service";

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor],
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.scss']
})
export class AddListingComponent implements OnInit {
  listingForm!: FormGroup;
  regions: Region[] = [];
  cities: City[] = [];
  filteredCities: City[] = [];
  constructor(
    private fb: FormBuilder,
    private geographicInfoService: GeographicInfoService,
    private agentService: AgentService,
  ) {
    this.agentService.getAgents().subscribe((agents) => {
      console.log(agents);
    });
  }

  ngOnInit() {
    this.initListingForm();
    this.getRegions();
    this.getCities();
  }

  onSubmit() {
    console.log(this.listingForm.value);
  }

  onRegionChange(event: Event) {
    const selectedRegionId = (event.target as HTMLSelectElement).value;
    this.filteredCities = this.cities.filter(city => city.region_id === Number(selectedRegionId));
  }

  getCityId(event: Event) {
    const target = event.target as HTMLSelectElement;
    const cityId = Number(target.value);
    this.listingForm.get('city')?.setValue(cityId);
    console.log(this.listingForm.value);
  }

  private initListingForm() {
    this.listingForm = this.fb.group({
      is_rental: ['0'],
      address: [''],
      zip_code: [''],
      description: [''],
      region: [''],
      city: [''],
      price: [''],
      bedrooms: [''],
      image: [''],

    });
  }

  private getRegions() {
    this.geographicInfoService.getRegions().subscribe((regions: Region[]) => {
      this.regions = regions;
    });
  }

  private getCities() {
    this.geographicInfoService.getCities().subscribe((cities: City[]) => {
      this.cities = cities;
      this.filteredCities = this.cities.filter(city => city.region_id === 1);
    });
  }
}
