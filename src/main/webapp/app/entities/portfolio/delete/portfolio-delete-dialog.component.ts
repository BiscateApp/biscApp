import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import SharedModule from 'app/shared/shared.module';
import { IPortfolio } from '../portfolio.model';
import { PortfolioService } from '../service/portfolio.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  standalone: true,
  templateUrl: './portfolio-delete-dialog.component.html',
  imports: [SharedModule, FormsModule],
})
export class PortfolioDeleteDialogComponent {
  portfolio?: IPortfolio;

  constructor(protected portfolioService: PortfolioService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.portfolioService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
