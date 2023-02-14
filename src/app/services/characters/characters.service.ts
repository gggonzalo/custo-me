import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, iif, map, mergeMap, Observable, of } from 'rxjs';
import { Character } from 'src/app/models/Character';
import { FiltersParams, FiltersSelection } from 'src/app/models/Filters';

@Injectable({
  providedIn: 'root',
})
export class CharactersService {
  constructor(private http: HttpClient) {}

  getCharacters(
    filtersSelection: FiltersSelection = {}
  ): Observable<Character[]> {
    const filtersParams = this.mapFiltersSelectionToParams(filtersSelection);

    return this.http
      .get<Character[]>('api/characters/characters2.json', {
        params: filtersParams,
      })
      .pipe(
        // TODO: Move filtering logic to backend
        delay(Math.floor(Math.random() * (1000 - 0 + 1) + 0)),
        mergeMap((characters) =>
          iif(
            () => Object.keys(filtersParams).length > 0,
            of(characters).pipe(
              map((characters) => {
                return characters.filter((c) => {
                  for (const [filterName, filterOptions] of Object.entries(
                    filtersParams
                  )) {
                    const characterOptionsForFilter = c.properties[filterName];

                    // TODO: See if we want to keep excluding (or not) the characters that don't have a property to filter
                    if (!characterOptionsForFilter) return false;

                    const propertyMeetsFilter = characterOptionsForFilter.some(
                      (po) => filterOptions.includes(po)
                    );

                    if (!propertyMeetsFilter) return false;
                  }

                  return true;
                });
              })
            ),
            of(characters)
          )
        )
      );
  }

  private mapFiltersSelectionToParams(
    filtersSelection: FiltersSelection
  ): FiltersParams {
    const filtersParams: FiltersParams = {};

    for (const filter in filtersSelection) {
      const optionsSelection = filtersSelection[filter];

      if (Object.values(optionsSelection).some((o) => o === true)) {
        filtersParams[filter] = Object.keys(optionsSelection).filter(
          (o) => optionsSelection[o] === true
        );
      }
    }

    return filtersParams;
  }
}
