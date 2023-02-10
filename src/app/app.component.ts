import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription, switchMap, tap } from 'rxjs';
import { Filter, FiltersSelection } from './models/Filters';
import { CharactersService as CharactersService } from './services/characters/characters.service';
import { FiltersService } from './services/filters/filters.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  filtersModalIsOpen: boolean = false;

  filters!: Filter[];
  filtersSelection: FiltersSelection = {};
  filtersSub!: Subscription;

  refreshCharactersToken$ = new BehaviorSubject(null);
  getCharactersTask = this.refreshCharactersToken$.pipe(
    switchMap(() =>
      this.charactersService.getCharacters(this.filtersSelection)
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

  ngOnInit(): void {
    this.filtersSub = this.filtersService.getFilters().subscribe({
      next: (filters) => (this.filters = filters),
    });
  }

  ngOnDestroy(): void {
    // TODO: See if by using async pipe we can remove unsubscriptions
    this.filtersSub.unsubscribe();
  }

  toogleFiltersModal() {
    this.filtersModalIsOpen = !this.filtersModalIsOpen;
  }

  handleModalHide() {
    this.filtersModalIsOpen = false;
  }

  handleFiltersSelected(filtersSelection: FiltersSelection) {
    this.filtersSelection = filtersSelection;

    this.charactersLoading = true;
    this.refreshCharactersToken$.next(null);
  }
}
