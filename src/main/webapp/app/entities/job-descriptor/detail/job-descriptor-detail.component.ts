import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';

import SharedModule from 'app/shared/shared.module';
import { DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe } from 'app/shared/date';
import { IJobDescriptor } from '../job-descriptor.model';

@Component({
  standalone: true,
  selector: 'jhi-job-descriptor-detail',
  templateUrl: './job-descriptor-detail.component.html',
  imports: [SharedModule, RouterModule, DurationPipe, FormatMediumDatetimePipe, FormatMediumDatePipe],
})
export class JobDescriptorDetailComponent {
  @Input() jobDescriptor: IJobDescriptor | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  previousState(): void {
    window.history.back();
  }
}
