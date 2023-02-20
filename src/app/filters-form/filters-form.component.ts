import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BehaviorSubject, merge, Observable, of, switchMap, tap } from 'rxjs';
import { Filter, FiltersFormValue } from '../models/Filters';

@Component({
  selector: 'app-filters-form',
  templateUrl: './filters-form.component.html',
  styleUrls: ['./filters-form.component.scss'],
})
// TODO: Change name to FiltersForm
export class FiltersFormComponent implements OnInit {
  @Input() filters!: Filter[];
  public isOpen!: boolean;

  // TODO: See if we still need this. Maybe in the mobile layout
  @Output() onHide = new EventEmitter();
  @Output() onFiltersSelected = new EventEmitter<FiltersFormValue>();

  filtersForm!: FormGroup;
  valueSinceLastSubmit!: FiltersFormValue;
  reportSubmitToken$ = new BehaviorSubject<null>(null);
  canSubmitFormCheckTask!: Observable<boolean>;

  constructor(private fb: FormBuilder) {}

  handleFiltersFormSubmit(): void {
    this.onFiltersSelected.emit(this.filtersForm.value);
    this.onHide.emit();

    this.reportSubmitToken$.next(null);
  }

  // TODO: Remove. Maybe use for mobile sidebar (form)
  handleCancel() {
    this.onHide.emit();
  }

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      filteringOptions: this.fb.group({
        mutuallyInclusiveFilters: false,
      }),
      filtersSelection: this.fb.group(
        Object.fromEntries(
          this.filters.map((f) => {
            return [
              f.name,
              this.fb.group(
                Object.fromEntries(
                  f.options.map((o) => {
                    // TODO: Maybe store the form values in local storage. Something like: [o.name, localStorage.get(o.name) || false]
                    return [o.name, false];
                  })
                )
              ),
            ];
          })
        )
      ),
    });

    // TODO: Add validation and disable/re-enable on ['filteringOptions']['mutuallyInclusiveFilters']

    this.canSubmitFormCheckTask = merge(
      this.reportSubmitToken$.pipe(
        tap(() => {
          this.valueSinceLastSubmit = this.filtersForm.value;
        }),
        switchMap(() => of(false))
      ),
      this.filtersForm.valueChanges.pipe(
        switchMap((currentValue) => {
          // Check if at least one filtering option selection control has changed
          if (
            currentValue['filteringOptions']['mutuallyInclusiveFilters'] !==
            this.valueSinceLastSubmit['filteringOptions'][
              'mutuallyInclusiveFilters'
            ]
          ) {
            return of(true);
          }

          // Check if at least one filter selection control has changed
          const filtersSelectionFormGroup = this.filtersForm.controls[
            'filtersSelection'
          ] as FormGroup;

          for (const [filterFormGroupName, filterFormGroup] of Object.entries(
            filtersSelectionFormGroup.controls
          )) {
            for (const filterOptionFormControlName of Object.keys(
              (filterFormGroup as FormGroup).controls
            )) {
              if (
                currentValue['filtersSelection'][filterFormGroupName][
                  filterOptionFormControlName
                ] !==
                this.valueSinceLastSubmit['filtersSelection'][
                  filterFormGroupName
                ][filterOptionFormControlName]
              ) {
                return of(true);
              }
            }
          }

          return of(false);
        })
      )
    );
  }
}
