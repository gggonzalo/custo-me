import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { CharacterCardComponent } from './character-card/character-card.component';
import { CheckboxComponent } from './checkbox/checkbox.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FiltersFormComponent } from './filters-form/filters-form.component';

@NgModule({
  declarations: [
    AppComponent,
    CharacterCardComponent,
    CheckboxComponent,
    FiltersFormComponent,
  ],
  imports: [BrowserModule, ReactiveFormsModule, HttpClientModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
