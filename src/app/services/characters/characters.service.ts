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
      .get<Character[]>('api/characters/characters.json', {
        params: filtersParams,
      })
      .pipe(
        delay(Math.floor(Math.random() * (1000 - 0 + 1) + 0)),
        // TODO: Move filtering logic to backend
        mergeMap((characters) =>
          iif(
            () => Object.keys(filtersParams).length > 0,
            of(characters).pipe(
              map((characters) =>
                characters.filter((c) => {
                  for (const property in c.properties) {
                    const propertyHasToBeFiltered =
                      Object.keys(filtersParams).includes(property);

                    if (propertyHasToBeFiltered) {
                      const filterOptions = filtersParams[property];
                      const propertyOptions = c.properties[property];

                      const filterAndPropertyOptionsIntersection =
                        filterOptions.filter((fo) =>
                          propertyOptions.includes(fo)
                        );
                      const propertyMeetsFilter =
                        filterAndPropertyOptionsIntersection.length > 0;

                      if (!propertyMeetsFilter) {
                        return false;
                      }
                    }
                  }

                  return true;
                })
              )
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
