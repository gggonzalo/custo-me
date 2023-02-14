import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, iif, map, mergeMap, Observable, of } from 'rxjs';
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

    return this.http
      .get<Character[]>('api/characters/characters.json', {
        params: filtersParams,
      })
      .pipe(
        // TODO: Move filtering logic to backend
        delay(2000),
        mergeMap((characters) =>
          iif(
            () => Object.keys(filtersParams).length > 0,
            of(characters).pipe(
              map((characters) => {
                const nonMutuallyInclusiveFiltersFilterFn = (c: Character) => {
                  for (const [filterName, filterOptions] of Object.entries(
                    filtersParams
                  )) {
                    const characterPropertyOptionsForFilter =
                      c.properties[filterName];

                    if (!characterPropertyOptionsForFilter) continue;

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
                    const characterPropertyOptionsForFilter =
                      c.properties[filterName];

                    if (!characterPropertyOptionsForFilter) continue;

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
