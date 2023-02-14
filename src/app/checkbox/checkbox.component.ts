import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
})
export class CheckboxComponent implements OnInit {
  @Input() groupPath!: string[];
  @Input() controlName!: string;

  parentFormGroup!: FormGroup;

  constructor(private rootFormGroupDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.parentFormGroup = this.rootFormGroupDirective.control.get(
      this.groupPath
    ) as FormGroup;
  }
}
