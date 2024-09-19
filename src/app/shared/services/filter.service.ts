import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  private filterCriteriaSource = new BehaviorSubject<any>(this.getInitialCriteria());

  public filterCriteria$ = this.filterCriteriaSource.asObservable();

  public getInitialCriteria() {
    const savedCriteria = localStorage.getItem('filterCriteria');
    return savedCriteria ? JSON.parse(savedCriteria) : {
      regionIds: [],
      priceMin: null,
      priceMax: null,
      areaMin: null,
      areaMax: null,
      bedrooms: null
    };
  }

  public updateFilterCriteria(newCriteria: any) {
    localStorage.setItem('filterCriteria', JSON.stringify(newCriteria));
    this.filterCriteriaSource.next(newCriteria);
  }

  public getCurrentFilterCriteria() {
    return this.filterCriteriaSource.getValue();
  }
}
