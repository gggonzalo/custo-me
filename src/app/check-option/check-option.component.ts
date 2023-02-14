import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';

@Component({
  selector: 'app-check-option',
  templateUrl: './check-option.component.html',
  styleUrls: ['./check-option.component.scss'],
  viewProviders: [
    {
      provide: ControlContainer,
      useExisting: FormGroupDirective,
    },
  ],
})
export class CheckOptionComponent implements OnInit {
  @Input() groupName!: string;
  @Input() controlName!: string;

  parentFormGroup!: FormGroup;

  constructor(private rootFormGroupDirective: FormGroupDirective) {}

  ngOnInit(): void {
    this.parentFormGroup = this.rootFormGroupDirective.control.get(
      this.groupName
    ) as FormGroup;
  }
}
