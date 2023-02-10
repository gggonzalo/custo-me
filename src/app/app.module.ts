import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CharacterCardComponent } from './character-card/character-card.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { CheckOptionComponent } from './check-option/check-option.component';
import { FiltersModalComponent } from './filters-modal/filters-modal.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    CharacterCardComponent,
    CheckboxComponent,
    CheckOptionComponent,
    FiltersModalComponent,
  ],
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
