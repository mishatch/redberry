import {Component, ViewChild} from '@angular/core';
import {NgbDropdownModule, NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {RouterLink} from "@angular/router";
import {AgentModalComponent} from "../agent-modal/agent-modal.component";

@Component({
  selector: 'app-filter',
  standalone: true,
  imports: [NgbDropdownModule, RouterLink, AgentModalComponent],
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent {
  @ViewChild('agentModal', { static: false }) agentModal!: AgentModalComponent;

  constructor(private modalService: NgbModal) {}

  openAgentModal() {
    this.agentModal.openModal();
  }
}
