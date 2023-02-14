import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Filter, FiltersFormValue, FiltersSelection } from '../models/Filters';

@Component({
  selector: 'app-filters-sidebar',
  templateUrl: './filters-sidebar.component.html',
  styleUrls: ['./filters-sidebar.component.scss'],
})
export class FiltersSidebarComponent implements OnInit {
  @Input() filters!: Filter[];
  private _isOpen!: boolean;
  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;

    document.body.style.overflow = value ? 'hidden' : 'auto';
    this.filtersSelectionSinceApply = this.filtersForm
      ? this.filtersForm.value
      : {};
  }
  get isOpen(): boolean {
    return this._isOpen;
  }

  @Output() onHide = new EventEmitter();
  @Output() onFiltersSelected = new EventEmitter<FiltersFormValue>();

  filtersForm!: FormGroup;
  filtersSelectionSinceApply: FiltersSelection = {};

  constructor(private fb: FormBuilder) {}

  handleFiltersFormSubmit(): void {
    this.onFiltersSelected.emit(this.filtersForm.value);

    this.onHide.emit();
  }

  // TODO: Remove
  handleCancel() {
    this.filtersForm.setValue(this.filtersSelectionSinceApply);

    this.onHide.emit();
  }

  ngOnInit(): void {
    // TODO: Maybe store this form state in localstorage
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
                    return [o.name, false];
                  })
                )
              ),
            ];
          })
        )
      ),
    });

    this.filtersForm.controls['filteringOptions'].valueChanges.subscribe(
      (_) => {
        const filtersSelectionFormGroup = this.filtersForm.controls[
          'filtersSelection'
        ] as FormGroup;

        for (const filterFormGroup of Object.values(
          filtersSelectionFormGroup.controls
        )) {
          const filterOptionsFormGroup = (filterFormGroup as FormGroup)
            .controls;

          const atLeastOneFilterOptionsIsSelected = Object.values(
            filterOptionsFormGroup
          )
            .map((optionFormControl) => optionFormControl.value)
            .some(
              (optionFormControlValue: boolean) =>
                optionFormControlValue === true
            );

          if (atLeastOneFilterOptionsIsSelected) {
            // TODO: Also check filters form is different since last submit
            this.onFiltersSelected.emit(this.filtersForm.value);
          }
        }
      }
    );
  }
}
