import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPortfolio, NewPortfolio } from '../portfolio.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPortfolio for edit and NewPortfolioFormGroupInput for create.
 */
type PortfolioFormGroupInput = IPortfolio | PartialWithRequiredKeyOf<NewPortfolio>;

type PortfolioFormDefaults = Pick<NewPortfolio, 'id'>;

type PortfolioFormGroupContent = {
  id: FormControl<IPortfolio['id'] | NewPortfolio['id']>;
  bio: FormControl<IPortfolio['bio']>;
  skills: FormControl<IPortfolio['skills']>;
  speakingLanguages: FormControl<IPortfolio['speakingLanguages']>;
  stars: FormControl<IPortfolio['stars']>;
  completedTasks: FormControl<IPortfolio['completedTasks']>;
  hourlyRate: FormControl<IPortfolio['hourlyRate']>;
};

export type PortfolioFormGroup = FormGroup<PortfolioFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PortfolioFormService {
  createPortfolioFormGroup(portfolio: PortfolioFormGroupInput = { id: null }): PortfolioFormGroup {
    const portfolioRawValue = {
      ...this.getFormDefaults(),
      ...portfolio,
    };
    return new FormGroup<PortfolioFormGroupContent>({
      id: new FormControl(
        { value: portfolioRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      bio: new FormControl(portfolioRawValue.bio, {
        validators: [Validators.minLength(10), Validators.maxLength(5000)],
      }),
      skills: new FormControl(portfolioRawValue.skills, {
        validators: [Validators.minLength(10), Validators.maxLength(100)],
      }),
      speakingLanguages: new FormControl(portfolioRawValue.speakingLanguages, {
        validators: [Validators.minLength(2), Validators.maxLength(100)],
      }),
      stars: new FormControl(portfolioRawValue.stars, {
        validators: [Validators.min(0), Validators.max(1000)],
      }),
      completedTasks: new FormControl(portfolioRawValue.completedTasks, {
        validators: [Validators.min(0), Validators.max(5000)],
      }),
      hourlyRate: new FormControl(portfolioRawValue.hourlyRate),
    });
  }

  getPortfolio(form: PortfolioFormGroup): IPortfolio | NewPortfolio {
    return form.getRawValue() as IPortfolio | NewPortfolio;
  }

  resetForm(form: PortfolioFormGroup, portfolio: PortfolioFormGroupInput): void {
    const portfolioRawValue = { ...this.getFormDefaults(), ...portfolio };
    form.reset(
      {
        ...portfolioRawValue,
        id: { value: portfolioRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PortfolioFormDefaults {
    return {
      id: null,
    };
  }
}
