import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IJobDescriptor } from '../job-descriptor.model';
import { JobDescriptorService } from '../service/job-descriptor.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './job-descriptor-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class JobDescriptorDeleteDialogComponent {
  jobDescriptor?: IJobDescriptor;

  constructor(protected jobDescriptorService: JobDescriptorService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.jobDescriptorService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
