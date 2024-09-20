import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import {CommonModule, NgFor} from "@angular/common";
import { FormatPricePipe } from "./format-price.pipe";
import { RealEstateService } from "../../../services/real-estate.service";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import {Estate} from "../../../../../shared/models/estate.model";
import {LoadingComponent} from "../../../../../shared/components/loading/loading.component";
import {Subscription} from "rxjs";

let nextId: number = 0;

@Component({
  selector: 'app-real-estate-details',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
    FormatPricePipe,
    NgFor,
    LoadingComponent
  ],
  templateUrl: './real-estate-details.component.html',
  styleUrls: ['./real-estate-details.component.scss']
})
export class RealEstateDetailsComponent implements OnInit, OnDestroy {

  public estate!: Estate;
  public similarEstates: Estate[] = [];
  public isLoading: boolean = true;
  public componentId: string | undefined = `carousel-id-${nextId++}`;
  public currentPage: number = 0;
  public itemMap: Map<number, Estate[]> | undefined;
  public itemKeys: number[] | undefined;
  public pageSize: number = 4;
  public numberOfPages: number = 0;
  public isNextDisabled: boolean = true;
  public isPrevDisabled: boolean = true;

  private subscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private estateService: RealEstateService,
    private modalService: NgbModal,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getEstate();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public openDeleteModal(content: TemplateRef<any>) {
    this.modalService.open(content, { centered: true });
  }

  public deleteEstate(id: number) {
    this.estateService.deleteEstate(id).subscribe(
      () => {
        this.modalService.dismissAll();
        this.router.navigate(['/']);
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

  public viewEstateDetails(estate: Estate) {
    this.isLoading = true;
    this.router.navigate(['/real-estate', estate.id]);
    this.getEstate(estate.id);
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

  private getEstate(similarId?: number): void {
    const id = similarId ? similarId : this.route.snapshot.paramMap.get('id');
    this.subscription =  this.estateService.getEstateById(id).subscribe(
      (data) => {
        this.estate = data;
        this.getSimilarEstates();
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }

  private getSimilarEstates(): void {
    this.subscription = this.estateService.getEstates().subscribe(
      (data) => {
        this.similarEstates = data.filter((estate: Estate) => estate.city_id === this.estate?.city_id && estate.id !== this.estate?.id);
        this.createSliderGroups();
        this.numberOfPages = Math.ceil(this.similarEstates.length / this.pageSize);
        this.calcButtonStates();
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
      }
    );
  }
}
