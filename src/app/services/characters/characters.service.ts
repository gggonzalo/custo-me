import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { iif, map, mergeMap, Observable, of } from 'rxjs';
import { Character } from 'src/app/models/Character';
import {
  FiltersParams,
  FiltersFormValue,
  FiltersSelection,
} from 'src/app/models/Filters';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  constructor(private http: HttpClient) {}

  getCharacters({
    filtersSelection,
    filteringOptions,
  }: FiltersFormValue): Observable<Character[]> {
    const filtersParams = this.mapFiltersSelectionToParams(filtersSelection);

    // TODO: Store this value in memory once fetched
    return this.http
      .get<Character[]>('api/characters/characters.json', {
        params: filtersParams,
      })
      .pipe(
        mergeMap((characters) =>
          iif(
            () => Object.keys(filtersParams).length > 0,
            of(characters).pipe(
              map((characters) => {
                const nonMutuallyInclusiveFiltersFilterFn = (c: Character) => {
                  for (const [filterName, filterOptions] of Object.entries(
                    filtersParams
                  )) {
                    const characterPropertyOptionsForFilter = c.properties
                      .filter((p) => p.name === filterName)
                      .map((p) => p.value);

                    if (characterPropertyOptionsForFilter.length === 0)
                      continue;

                    const propertyMeetsFilter =
                      characterPropertyOptionsForFilter.some((po) =>
                        filterOptions.includes(po)
                      );

                    if (propertyMeetsFilter) {
                      return true;
                    }
                  }

                  return false;
                };
                const mutuallyInclusiveFiltersFilterFn = (c: Character) => {
                  for (const [filterName, filterOptions] of Object.entries(
                    filtersParams
                  )) {
                    const characterPropertyOptionsForFilter = c.properties
                      .filter((p) => p.name === filterName)
                      .map((p) => p.value);

                    if (characterPropertyOptionsForFilter.length === 0)
                      continue;

                    const propertyMeetsFilter =
                      characterPropertyOptionsForFilter.some((po) =>
                        filterOptions.includes(po)
                      );

                    if (!propertyMeetsFilter) {
                      return false;
                    }
                  }

                  return true;
                };

                const charactersFilterFn =
                  filteringOptions.mutuallyInclusiveFilters
                    ? mutuallyInclusiveFiltersFilterFn
                    : nonMutuallyInclusiveFiltersFilterFn;

                return characters.filter(charactersFilterFn);
              })
            ),
            of(characters)
          )
        )
      );
  }

  private mapFiltersSelectionToParams(
    filters: FiltersSelection
  ): FiltersParams {
    const filtersParams: FiltersParams = {};

    for (const filter in filters) {
      const optionsSelection = filters[filter];

      if (Object.values(optionsSelection).some((o) => o === true)) {
        filtersParams[filter] = Object.keys(optionsSelection).filter(
          (o) => optionsSelection[o] === true
        );
      }
    }

    return filtersParams;
  }
}
