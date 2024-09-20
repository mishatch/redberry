import {Component, OnInit, TemplateRef, ViewChild, ElementRef, OnDestroy} from '@angular/core';
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { emailDomainValidator } from "../../validators/email-domain.validator";
import { phoneNumberValidator } from "../../validators/phone-number.validator";
import {catchError, Observable, of, Subscription} from "rxjs";
import {AgentService} from "../../services/agent.service";
import {LoadingComponent} from "../loading/loading.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-agent-modal',
  standalone: true,
  imports: [ReactiveFormsModule, LoadingComponent],
  templateUrl: './agent-modal.component.html',
  styleUrls: ['./agent-modal.component.scss']
})
export class AgentModalComponent implements OnInit {
  public agentForm!: FormGroup;
  public selectedFile: File | null = null;
  public imagePreview: string | ArrayBuffer | null = null;
  public isLoading: boolean = false;

  @ViewChild('agentModalTemplate') agentModalTemplate!: TemplateRef<any>;
  @ViewChild('fileInput') fileInput!: ElementRef;

  private modalRef: any;

  constructor(private ngbModal: NgbModal, private fb: FormBuilder, private agentService: AgentService, private router: Router) {}

  ngOnInit() {
    this.initAgentForm();
    this.loadFormData();
  }

  public openModal() {
    this.modalRef = this.ngbModal.open(this.agentModalTemplate, {
      centered: true,
      size: 'xl'
    });
  }

  public onSubmit() {
    if (this.selectedFile) {
      this.isLoading = true;
      const formData = new FormData();
      formData.append('name', this.agentForm.get('name')?.value);
      formData.append('surname', this.agentForm.get('surname')?.value);
      formData.append('email', this.agentForm.get('email')?.value);
      formData.append('phone', this.agentForm.get('phone')?.value);
      formData.append('avatar', this.selectedFile);

      this.agentService.addAgent(formData).subscribe(
          response => {
            this.clearLocalStorage();
            this.initAgentForm();
            this.deleteImage();
            this.modalRef.close('Close click');
            this.isLoading = false;
            if(this.router.url === '/add-listing') {
              window.location.reload();
            }
          },
          error => {
            this.isLoading = false;
          }
      );
    }
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

  public onCancel() {
    this.clearLocalStorage();
    this.initAgentForm();
    this.deleteImage();
    if (this.modalRef) {
      this.modalRef.close('Close click');
    }
  }

  get name() {
    return this.agentForm.get('name');
  }

  get surname() {
    return this.agentForm.get('surname');
  }

  get email() {
    return this.agentForm.get('email');
  }

  get phone() {
    return this.agentForm.get('phone');
  }

  private initAgentForm() {
    this.agentForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      surname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email, emailDomainValidator('redberry.ge')]],
      phone: ['', [Validators.required, phoneNumberValidator()]],
    });

    this.agentForm.valueChanges.subscribe(values => {
      localStorage.setItem('agentFormData', JSON.stringify(values));
    });
  }

  private loadFormData() {
    const savedData = localStorage.getItem('agentFormData');
    if (savedData) {
      const data = JSON.parse(savedData);
      this.agentForm.setValue(data);
    }

    const savedImagePreview = localStorage.getItem('agentImagePreview');
    if (savedImagePreview) {
      this.imagePreview = savedImagePreview;
    }

    const savedFile = localStorage.getItem('agentFile');
    if (savedFile) {
      this.convertBase64ToFile(savedFile, 'savedFile').subscribe(file => {
        if (file) {
          this.selectedFile = file;
        }
      });
    }
  }

  private saveFileData() {
    if (this.imagePreview) {
      localStorage.setItem('agentImagePreview', this.imagePreview as string);
    }
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const fileData = reader.result as string;
        localStorage.setItem('agentFile', fileData);
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  private removeFileData() {
    localStorage.removeItem('agentFile');
    localStorage.removeItem('agentImagePreview');
  }

  private convertBase64ToFile(base64: string, fileName: string): Observable<File | null> {
    return new Observable<File | null>(observer => {
      const [meta, base64Data] = base64.split(',');
      if (!meta || !base64Data) {
        observer.error('Invalid base64 data');
        return;
      }

      const mimeMatch = meta.match(/:(.*?);/);
      if (!mimeMatch) {
        observer.error('Cannot extract MIME type');
        return;
      }

      const mime = mimeMatch[1];
      const binary = atob(base64Data);
      const array = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) {
        array[i] = binary.charCodeAt(i);
      }
      const blob = new Blob([array], { type: mime });
      observer.next(new File([blob], fileName));
      observer.complete();
    }).pipe(
        catchError(error => {
          console.error(error);
          return of(null);
        })
    );
  }

  private clearLocalStorage() {
    localStorage.removeItem('agentFormData');
    localStorage.removeItem('agentFile');
    localStorage.removeItem('agentImagePreview');
  }
}
