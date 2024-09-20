import { Component, OnInit, ViewChild } from '@angular/core';
import { NgbDropdownModule} from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { AgentModalComponent } from '../../../../shared/components/agent-modal/agent-modal.component';
import { Region } from '../../../add-listing/models/geographic.models';
import { GeographicInfoService } from '../../../../shared/services/geographic-info.service';
import { FilterService } from '../../../../shared/services/filter.service';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {minLessThanMaxValidator} from "../../../../shared/validators/min-less-than-max.validator";
import {Subscription} from "rxjs";
import {FilterOptions} from "../../../../shared/models/filter-options.model";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgbDropdownModule, RouterLink, AgentModalComponent, ReactiveFormsModule, FormsModule],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  public priceForm!: FormGroup;
  public areaForm!: FormGroup;

  public selectedRegionIds: { [key: number]: boolean } = {};
  public bedrooms: number | null = null;

  public filterOptions: FilterOptions = {} as FilterOptions;
  public regions: Region[] = [];

  private filterSubscription: Subscription = new Subscription();

  @ViewChild('agentModal', { static: false }) agentModal!: AgentModalComponent;

  constructor(
    private geographicInfoService: GeographicInfoService,
    private filterService: FilterService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.getRegions();
    this.initPriceForm();
    this.initAreaForm();

    const savedCriteria = this.filterService.getCurrentFilterCriteria();
    this.bedrooms = savedCriteria.bedrooms;
    this.priceForm.patchValue({
      minPrice: savedCriteria.priceMin,
      maxPrice: savedCriteria.priceMax
    });
    this.areaForm.patchValue({
      minArea: savedCriteria.areaMin,
      maxArea: savedCriteria.areaMax
    });

    this.filterSubscription.add(
      this.filterService.filterCriteria$.subscribe(criteria => {
        this.filterOptions = criteria;
        this.updateSelectedRegionIds();
      })
    );
  }

  public openAgentModal() {
    this.agentModal.openModal();
  }

  public setMinPrice(price: number) {
    this.priceForm.get('minPrice')?.setValue(price);
  }

  public setMaxPrice(price: number) {
    this.priceForm.get('maxPrice')?.setValue(price);
  }

  public setMinArea(area: number) {
    this.areaForm.get('minArea')?.setValue(area);
  }

  public setMaxArea(area: number) {
    this.areaForm.get('maxArea')?.setValue(area);
  }

  public getRegionNameById(regionId: number): string {
    const region = this.regions.find(r => r.id === regionId);
    return region ? region.name : 'Unknown Region';
  }

  public removeRegion(regionId: number) {
    const updatedRegionIds = this?.filterOptions?.regionIds?.filter(id => id !== regionId);

    this.filterService.updateFilterCriteria({
      ...this.filterOptions,
      regionIds: updatedRegionIds
    });

    this.filterOptions.regionIds = updatedRegionIds;
  }

  public hasSelectedRegions(): boolean {
    return Object.keys(this.selectedRegionIds).length > 0;
  }

  public onSubmitRegion() {
    const selectedRegionIds = Object.keys(this.selectedRegionIds)
      .filter(id => this.selectedRegionIds[+id])
      .map(id => +id);

    const regionFilterCriteria = {
      regionIds: selectedRegionIds
    };

    const currentCriteria = this.filterService.getCurrentFilterCriteria();
    const updatedCriteria = {
      ...currentCriteria,
      ...regionFilterCriteria
    };

    this.filterService.updateFilterCriteria(updatedCriteria);

  }

  public onSubmitPrice() {
    if (this.priceForm.valid) {
      const priceFilterCriteria = {
        priceMin: Number(this.priceForm.get('minPrice')?.value),
        priceMax: Number(this.priceForm.get('maxPrice')?.value)
      };

      const currentCriteria = this.filterService.getCurrentFilterCriteria();
      const updatedCriteria = {
        ...currentCriteria,
        ...priceFilterCriteria
      };

      this.filterService.updateFilterCriteria(updatedCriteria);
    }
  }

  public onClearPrice() {
    this.priceForm.patchValue({
      minPrice: null,
      maxPrice: null
    });

    const currentCriteria = this.filterService.getCurrentFilterCriteria();
    const updatedCriteria = {
      ...currentCriteria,
      priceMin: null,
      priceMax: null
    };

    this.filterService.updateFilterCriteria(updatedCriteria);
  }

  public onSubmitArea() {
    if (this.areaForm.valid) {
      const areaFilterCriteria = {
        areaMin: Number(this.areaForm.get('minArea')?.value),
        areaMax: Number(this.areaForm.get('maxArea')?.value)
      };

      const currentCriteria = this.filterService.getCurrentFilterCriteria();
      const updatedCriteria = {
        ...currentCriteria,
        ...areaFilterCriteria
      };

      this.filterService.updateFilterCriteria(updatedCriteria);
    }
  }

  public onClearArea() {
    this.areaForm.patchValue({
      minArea: null,
      maxArea: null
    });

    const currentCriteria = this.filterService.getCurrentFilterCriteria();
    const updatedCriteria = {
      ...currentCriteria,
      areaMin: null,
      areaMax: null
    };

    this.filterService.updateFilterCriteria(updatedCriteria);
  }

  public onSubmitBedrooms() {
    const currentCriteria = this.filterService.getCurrentFilterCriteria();
    const updatedCriteria = {
      ...currentCriteria,
      bedrooms: this.bedrooms
    };

    this.filterService.updateFilterCriteria(updatedCriteria);
  }

  public onClearBedrooms() {
    this.bedrooms = null;

    const currentCriteria = this.filterService.getCurrentFilterCriteria();
    const updatedCriteria = {
      ...currentCriteria,
      bedrooms: null
    };

    this.filterService.updateFilterCriteria(updatedCriteria);
  }

  public clearFilter() {
    this.priceForm.patchValue({
      minPrice: null,
      maxPrice: null
    });

    this.areaForm.patchValue({
      minArea: null,
      maxArea: null
    });

    this.bedrooms = null;

    this.filterService.updateFilterCriteria({
      regionIds: [],
      priceMin: null,
      priceMax: null,
      areaMin: null,
      areaMax: null,
      bedrooms: null
    });
  }

  get minPrice() {
    return this.priceForm.get('minPrice');
  }

  get maxPrice() {
    return this.priceForm.get('maxPrice');
  }

  get minArea() {
    return this.areaForm.get('minArea');
  }

  get maxArea() {
    return this.areaForm.get('maxArea');
  }

  private getRegions() {
    this.geographicInfoService.getRegions().subscribe((regions) => {
      this.regions = regions;
    });
  }

  private updateSelectedRegionIds() {
    if (this.filterOptions.regionIds) {
      this.selectedRegionIds = this.regions.reduce((acc, region) => {
        acc[region.id] = this?.filterOptions?.regionIds?.includes(region.id) || false;
        return acc;
      }, {} as { [key: number]: boolean });
    } else {
      this.selectedRegionIds = this.regions.reduce((acc, region) => {
        acc[region.id] = false;
        return acc;
      }, {} as { [key: number]: boolean });
    }
  }

  private initPriceForm() {
    this.priceForm = this.fb.group(
      {
        minPrice: [null],
        maxPrice: [null]
      },
      {
        validator: minLessThanMaxValidator('minPrice', 'maxPrice')
      }
    );

  }

  private initAreaForm() {
    this.areaForm = this.fb.group(
      {
        minArea: [null],
        maxArea: [null]
      },
      {
        validator: minLessThanMaxValidator('minArea', 'maxArea')
      }
    );
  }
}
