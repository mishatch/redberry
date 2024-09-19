import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {GeographicInfoService} from '../../shared/services/geographic-info.service';
import {City, Region} from "./models/geographic.models";
import {AgentService} from "../../shared/services/agent.service";
import {Agent} from "../../shared/models/agent.model";
import {minWordsValidator} from "../../shared/validators/min-words.validator";
import {Observable} from "rxjs";
import {ListingService} from "./services/listing.service";
import {Router} from "@angular/router";
import {selectIdValidator} from "../../shared/validators/select-id.validator";
import {AgentModalComponent} from "../../shared/components/agent-modal/agent-modal.component";
import {NgbDropdownModule} from "@ng-bootstrap/ng-bootstrap";
import {NgFor} from "@angular/common";

@Component({
  selector: 'app-add-listing',
  standalone: true,
  imports: [ReactiveFormsModule, AgentModalComponent, NgbDropdownModule, NgFor],
  templateUrl: './add-listing.component.html',
  styleUrls: ['./add-listing.component.scss']
})
export class AddListingComponent implements OnInit {
  public listingForm!: FormGroup;
  public selectedAgentId: number | null = null;

  public regions: Region[] = [];
  public cities: City[] = [];
  public filteredCities: City[] = [];
  public agents: Agent[] = [];

  public selectedFile: File | null = null;
  public imagePreview: string | ArrayBuffer | null = null;


  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('agentModal', { static: false }) agentModal!: AgentModalComponent;

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

  public selectAgent(agent: Agent) {
    this.selectedAgentId = agent.id;
    this.listingForm.get('agent_id')?.setValue(agent.id);
    localStorage.setItem('agentId', agent.id.toString());
  }
  public getSelectedAgentName(): string | null {
    const selectedAgent = this.agents.find(agent => agent.id === this.selectedAgentId);
    return selectedAgent ? `${selectedAgent.name} ${selectedAgent.surname}` : null;
  }

  public onDropdownClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
  }
  public onSubmit() {
    if(this.selectedFile){

      const formData = this.createFormData();
      this.listingService.addListing(formData).subscribe(
        response => {
          this.initListingForm();
          this.deleteImage();
          this.clearLocalStorage();
        },
        error => {
          console.log(error);
        }
      );
    }
  }

  public onCancel() {
    this.clearLocalStorage();
  }

  public onRegionChange(event: Event) {

    const selectedRegionId = (event.target as HTMLSelectElement).value;
    this.listingForm.get('region')?.setValue(Number(selectedRegionId));

    localStorage.setItem('regionId', selectedRegionId);

    this.filteredCities = this.cities.filter(city => city.region_id === Number(selectedRegionId));

    const savedCityId = localStorage.getItem('cityId');

    if (savedCityId && this.filteredCities.some(city => city.id === Number(savedCityId))) {
      this.listingForm.get('city')?.setValue(Number(savedCityId));
    }

  }

  public getCityId(event: Event) {

    const cityId = (event.target as HTMLSelectElement).value;
    this.listingForm.get('city')?.setValue(Number(cityId));

    localStorage.setItem('cityId', cityId);
  }

  public onFileSelected(event: Event) {

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

  public deleteImage() {

    this.selectedFile = null;
    this.imagePreview = null;
    this.removeFileData();

    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  public openAgentModal() {
    this.agentModal.openModal();
  }



  //getters

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
      city: ['-1', [Validators.required, selectIdValidator]],
      price: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      region: ['-1', [Validators.required, selectIdValidator]],
      bedrooms: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      area: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]+)?$')]],
      agent_id: ['-1', [Validators.required, selectIdValidator]],
    });

    this.listingForm.valueChanges.subscribe(values => {
      localStorage.setItem('estateFormData', JSON.stringify(values));
    });
  }

  private loadFormData() {
    const savedData = localStorage.getItem('estateFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.listingForm.setValue(data);
      this.selectedAgentId = data.agent_id;
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

      const savedRegionId = localStorage.getItem('regionId');
      if (savedRegionId) {
        this.listingForm.get('region')?.setValue(Number(savedRegionId));
        this.onRegionChange({ target: { value: savedRegionId } } as unknown as Event);
      }
    });
  }

  private getCities() {
    this.geographicInfoService.getCities().subscribe((cities: City[]) => {
      this.cities = cities;

      const savedRegionId = localStorage.getItem('regionId') || this.listingForm.get('region')?.value;
      this.filteredCities = this.cities.filter(city => city.region_id === Number(savedRegionId));

      const savedCityId = localStorage.getItem('cityId');
      if (savedCityId) {

        this.listingForm.get('city')?.setValue(Number(savedCityId));

      }
    });
  }

  private getAgents() {
    this.agentService.getAgents().subscribe((agents: Agent[]) => {
      this.agents = agents;

      const savedAgentId = localStorage.getItem('agentId');
      if (savedAgentId) {
        this.listingForm.get('agent_id')?.setValue(Number(savedAgentId));
      }
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

  private clearLocalStorage() {
    localStorage.removeItem('estateFormData');
    localStorage.removeItem('estateFile');
    localStorage.removeItem('estateImagePreview');
    localStorage.removeItem('regionId');
    localStorage.removeItem('cityId');
    localStorage.removeItem('agentId');
    this.router.navigate(['/']);
  }

  private createFormData() {
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


      return formData;
    }
    return null;
  }

}
