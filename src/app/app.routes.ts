import { Routes } from '@angular/router';
import {HomeComponent} from "./features/home/home.component";
import {AddListingComponent} from "./features/add-listing/add-listing.component";
import {AddAgentComponent} from "./features/add-agent/add-agent.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'add-listing',
    component: AddListingComponent,
  },
  {
    path: 'add-agent',
    component: AddAgentComponent,
  },
];
