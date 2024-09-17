import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterCriteriaSource = new BehaviorSubject<any>({
    regionIds: [],
    priceMin: null,
    priceMax: null,
    areaMin: null,
    areaMax: null,
    bedrooms: null
  });
  filterCriteria$ = this.filterCriteriaSource.asObservable();

  updateFilterCriteria(newCriteria: any) {
    this.filterCriteriaSource.next(newCriteria);
  }
  getCurrentFilterCriteria() {
    return this.filterCriteriaSource.getValue();
  }
}
