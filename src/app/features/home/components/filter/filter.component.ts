import { Component } from '@angular/core';
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgbDropdownModule, RouterLink],
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.scss'
})
export class FilterComponent {

}
