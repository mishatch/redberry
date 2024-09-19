import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { AddListingComponent } from './features/add-listing/add-listing.component';
import { RealEstateDetailsComponent } from './features/home/components/real-estates/real-estate-details/real-estate-details.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'add-listing',
    component: AddListingComponent,
  },
  { path: 'real-estate/:id', component: RealEstateDetailsComponent },
  { path: '**', redirectTo: '', pathMatch: 'full' },
];
