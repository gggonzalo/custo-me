import { Component } from '@angular/core';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { Filter, FiltersFormValue } from './models/Filters';
import { CharactersService as CharactersService } from './services/characters/characters.service';
import { FiltersService } from './services/filters/filters.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  getFiltersTask$: Observable<Filter[]> = this.filtersService.getFilters();

  filtersFormIsOpen: boolean = false;

  // TODO: This might have to change if we are getting filters from local storage
  refreshCharactersToken$ = new BehaviorSubject<FiltersFormValue>({
    filteringOptions: {
      mutuallyInclusiveFilters: false,
    },
    filtersSelection: {},
  });
  getCharactersTask = this.refreshCharactersToken$.pipe(
    switchMap((filtersFormValue) =>
      this.charactersService.getCharacters(filtersFormValue)
    ),
    tap(() => {
      this.charactersLoading = false;
    })
  );
  charactersLoading: boolean = true;

  constructor(
    private filtersService: FiltersService,
    private charactersService: CharactersService
  ) {}

  handleFiltersFormOpen() {
    this.filtersFormIsOpen = true;
  }

  handleFiltersFormClose() {
    this.filtersFormIsOpen = false;
  }

  handleFiltersSelected(filtersFormValue: FiltersFormValue) {
    this.charactersLoading = true;
    this.refreshCharactersToken$.next(filtersFormValue);
  }
}
