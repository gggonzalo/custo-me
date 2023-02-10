import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Filter, FiltersSelection } from '../models/Filters';

@Component({
  selector: 'app-filters-modal',
  templateUrl: './filters-modal.component.html',
  styleUrls: ['./filters-modal.component.scss'],
})
export class FiltersModalComponent implements OnInit {
  @Input() filters!: Filter[];
  private _isOpen!: boolean;
  @Input()
  set isOpen(value: boolean) {
    this._isOpen = value;

    document.body.style.overflow = value ? 'hidden' : 'auto';
    this.filtersSelectionSinceOpen = this.filtersForm
      ? this.filtersForm.value
      : {};
  }
  get isOpen(): boolean {
    return this._isOpen;
  }

  @Output()
  onHide = new EventEmitter();
  @Output()
  onFiltersSelected = new EventEmitter<FiltersSelection>();

  filtersForm!: FormGroup;
  filtersSelectionSinceOpen: FiltersSelection = {};

  constructor(private fb: FormBuilder) {}

  handleFiltersFormSubmit(): void {
    this.onFiltersSelected.emit(this.filtersForm.value as FiltersSelection);

    this.onHide.emit();
  }

  handleCancel() {
    this.filtersForm.setValue(this.filtersSelectionSinceOpen);

    this.onHide.emit();
  }

  ngOnInit(): void {
    this.filtersForm = this.fb.group(
      Object.fromEntries(
        this.filters.map((f) => {
          return [
            f.name,
            this.fb.group(
              Object.fromEntries(
                f.options.map((o) => {
                  // TODO: Maybe store this state in localstorage
                  return [o.name, false];
                })
              )
            ),
          ];
        })
      )
    );
  }
}
