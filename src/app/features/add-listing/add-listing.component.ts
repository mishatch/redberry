import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GeographicInfoService} from './services/geographic-info.service';
import {City, Region} from "./models/geographic.models";
import {AgentService} from "../../shared/services/agent.service";
import {Agent} from "../../shared/models/agent.model";
import {minWordsValidator} from "../../shared/validators/min-words.validator";
import {Observable} from "rxjs";
import {ListingService} from "./services/listing.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.scss']
})
export class AddListingComponent implements OnInit {
  public listingForm!: FormGroup;

  //needs refactor here
  public regions: Region[] = [];
  public cities: City[] = [];
  public filteredCities: City[] = [];
  public agents: Agent[] = [];

  public selectedFile: File | null = null;
  public imagePreview: string | ArrayBuffer | null = null;


  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private geographicInfoService: GeographicInfoService,
    private agentService: AgentService,
    private listingService: ListingService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.initListingForm();
    this.loadFormData();
    this.getRegions();
    this.getCities();
    this.getAgents();
  }

  public onSubmit() {
    if(this.selectedFile){
      const formData = new FormData();
      const created_at = new Date().toISOString();
      formData.append('is_rental', this.listingForm.get('is_rental')?.value);
      formData.append('address', this.listingForm.get('address')?.value);
      formData.append('zip_code', this.listingForm.get('zip_code')?.value);
      formData.append('description', this.listingForm.get('description')?.value);
      formData.append('city_id', this.listingForm.get('city')?.value);
      formData.append('price', this.listingForm.get('price')?.value);
      formData.append('bedrooms', this.listingForm.get('bedrooms')?.value);
      formData.append('area', this.listingForm.get('area')?.value);
      formData.append('created_at', created_at);
      formData.append('region_id', this.listingForm.get('region')?.value);
      formData.append('agent_id', this.listingForm.get('agent_id')?.value);
      formData.append('image', this.selectedFile);


      this.listingService.addListing(formData).subscribe(
        response => {
          console.log(response);
          this.initListingForm();
          this.deleteImage();
          localStorage.removeItem('estateFormData');
          localStorage.removeItem('estateFile');
          localStorage.removeItem('estateImagePreview');

        },
        error => {
          console.log(error);
        }
      );
    }
    console.log(this.listingForm.value);
    console.log(this.selectedFile);
  }

  onRegionChange(event: Event) {
    const selectedRegionId = (event.target as HTMLSelectElement).value;
    this.listingForm.get('region')?.setValue(Number(selectedRegionId));
    this.filteredCities = this.cities.filter(city => city.region_id === Number(selectedRegionId));
    this.listingForm.get('city')?.setValue(this.filteredCities[0].id);
  }

  getCityId(event: Event) {
    const target = event.target as HTMLSelectElement;
    const cityId = Number(target.value);
    this.listingForm.get('city')?.setValue(cityId);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.saveFileData();
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  deleteImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.removeFileData();

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }
  getAgent(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.listingForm.get('agent_id')?.setValue(Number(target.value));
  }

  onCancel() {
    this.router.navigate(['/']);
  }

  get address() {
    return this.listingForm.get('address');
  }

  get zip_code() {
    return this.listingForm.get('zip_code');
  }

  get description() {
    return this.listingForm.get('description');
  }



  get city() {
    return this.listingForm.get('city');
  }

  get price() {
    return this.listingForm.get('price');
  }

  get bedrooms() {
    return this.listingForm.get('bedrooms');
  }

  get area() {
    return this.listingForm.get('area');
  }

  private initListingForm() {
    this.listingForm = this.fb.group({
      is_rental: ['0'],
      address: ['', [Validators.required, Validators.minLength(2)]],
      zip_code: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      description: ['', [Validators.required, minWordsValidator(5)]],
      city: ['', [Validators.required]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      region: ['', [Validators.required]],
      bedrooms: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      area: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      agent_id: [''],
    });

    // Save form data to localStorage on value changes
    this.listingForm.valueChanges.subscribe(values => {
      localStorage.setItem('estateFormData', JSON.stringify(values));
    });
  }

  private loadFormData() {
    const savedData = localStorage.getItem('estateFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.listingForm.setValue(data);
    }

    const savedImagePreview = localStorage.getItem('estateImagePreview');
    if (savedImagePreview) {
      this.imagePreview = savedImagePreview;
    }

    const savedFile = localStorage.getItem('estateFile');
    if (savedFile) {
      this.convertBase64ToFile(savedFile, 'savedFile').subscribe(file => {
        if (file) {
          this.selectedFile = file;
        }
      });
    }
  }


  private convertBase64ToFile(base64: string, fileName: string) {
    // Conversion logic to convert base64 string back to file
    return new Observable<File | null>(observer => {
      const [meta, base64Data] = base64.split(',');
      const mime = meta.match(/:(.*?);/)?.[1];
      const binary = atob(base64Data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: mime });
      observer.next(new File([blob], fileName));
      observer.complete();
    });
  }

  private getRegions() {
    this.geographicInfoService.getRegions().subscribe((regions: Region[]) => {
      this.regions = regions;
      this.listingForm.get('region')?.setValue(this.regions[0].id);
    });
  }

  private getCities() {
    this.geographicInfoService.getCities().subscribe((cities: City[]) => {
      this.cities = cities;
      this.filteredCities = this.cities.filter(city => city.region_id === 1);
      this.listingForm.get('city')?.setValue(this.cities[0].id);
    });
  }

  private getAgents() {
    this.agentService.getAgents().subscribe((agents: Agent[]) => {
      this.agents = agents;
      this.listingForm.get('agent_id')?.setValue(this.agents[0].id);
    });
  }

  private saveFileData() {
    if (this.imagePreview) {
      localStorage.setItem('estateImagePreview', this.imagePreview as string);
    }
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = reader.result as string;
        localStorage.setItem('estateFile', fileData);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private removeFileData() {
    localStorage.removeItem('estateFile');
    localStorage.removeItem('estateImagePreview');
  }

}
