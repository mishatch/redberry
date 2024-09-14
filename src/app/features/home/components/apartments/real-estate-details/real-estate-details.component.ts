import { Component, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormatPricePipe } from "./format-price.pipe";
import { RealEstateService } from "../../../services/real-estate.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

let nextId: number = 0;

@Component({
  selector: 'app-real-estate-details',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormatPricePipe,
  ],
  templateUrl: './real-estate-details.component.html',
  styleUrls: ['./real-estate-details.component.scss']
})
export class RealEstateDetailsComponent implements OnInit {
  estate: any;
  similarEstates: any[] = [];
  isLoading: boolean = true;
  public componentId: string | undefined = `carousel-id-${nextId++}`;
  public currentPage: number = 0;
  public itemMap: Map<number, any[]> | undefined;
  public itemKeys: number[] | undefined;
  public pageSize: number = 4;
  public numberOfPages: number = 0;
  public isNextDisabled: boolean = true;
  public isPrevDisabled: boolean = true;

  constructor(
    private route: ActivatedRoute,
    private estateService: RealEstateService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEstate();
  }

  openDeleteModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  deleteEstate(id: any) {
    this.estateService.deleteEstate(id).subscribe(
      () => {
        this.modalService.dismissAll();
        this.router.navigate(['/']);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  public navToNext(): void {
    if (this.currentPage >= this.numberOfPages - 1) {
      this.reset();
    } else {
      this.currentPage = this.currentPage + 1;
      this.navigateToGroup(this.currentPage);
    }
  }

  public navToPrev(): void {
    this.currentPage = this.currentPage - 1;
    this.navigateToGroup(this.currentPage);
  }

  private navigateToGroup(groupId: number): void {
    this.calcButtonStates();
    const sliderGroup: Element | null = document.querySelector(
      `#${this.componentId}-group-${groupId}`
    );

    sliderGroup?.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
      behavior: 'smooth',
    });
  }

  private createSliderGroups(): void {
    if (this.similarEstates) {
      this.itemMap = new Map();
      let groupIndex: number = 0;

      for (let i: number = 0; i < this.similarEstates.length; i += this.pageSize) {
        const group: any[] = this.similarEstates.slice(i, i + this.pageSize);

        this.itemMap.set(groupIndex, group);
        groupIndex++;
      }

      this.itemKeys = Array.from(this.itemMap.keys());
    }
  }

  private reset(): void {
    this.currentPage = 0;
    this.navigateToGroup(this.currentPage);
  }

  private calcButtonStates(): void {
    this.isNextDisabled = this.currentPage + 1 >= this.numberOfPages;
    this.isPrevDisabled = this.currentPage <= 0;
  }

  private getEstate(similarId?: any): void {
    const id = similarId ? similarId : this.route.snapshot.paramMap.get('id');
    this.estateService.getEstateById(id).subscribe(
      (data) => {
        this.estate = data;
        this.getSimilarEstates();
      },
      (error) => {
        console.error(error);
      }
    );
  }

  private getSimilarEstates(): void {
    this.estateService.getEstates().subscribe(
      (data: any) => {
        this.similarEstates = data.filter((estate: any) => estate.city_id === this.estate?.city_id);
        this.createSliderGroups();
        this.numberOfPages = Math.ceil(this.similarEstates.length / this.pageSize);
        this.calcButtonStates();
        this.isLoading = false;
      },
      (error) => {
        console.error(error);
      }
    );
  }
  viewEstateDetails(estate: any) {
    this.isLoading = true;
    this.router.navigate(['/real-estate', estate.id]);
    this.getEstate(estate.id);
  }
}
