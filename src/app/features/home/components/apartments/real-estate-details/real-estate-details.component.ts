import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {CommonModule} from "@angular/common";
import {FormatPricePipe} from "./format-price.pipe";

@Component({
  selector: 'app-real-estate-details',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormatPricePipe
  ],
  templateUrl: './real-estate-details.component.html',
  styleUrl: './real-estate-details.component.scss'
})
export class RealEstateDetailsComponent implements OnInit{
  estate: any;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.estate = history.state.estate;
    console.log(this.estate);
    if (!this.estate) {
      this.router.navigate(['/apartments']);
    }
  }
}
