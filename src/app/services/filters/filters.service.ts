import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Character } from 'src/app/models/Character';
import { Filter } from 'src/app/models/Filters';

@Injectable({
  providedIn: 'root',
})
export class FiltersService {
  constructor(private http: HttpClient) {}

  getFilters(): Observable<Filter[]> {
    // TODO: Move this logic to a backend server
    return this.http.get<Character[]>('api/characters/characters.json').pipe(
      map((characters) => {
        const filters: Filter[] = [];

        for (const character of characters) {
          for (const propertyName in character.properties) {
            if (
              Object.prototype.hasOwnProperty.call(
                character.properties,
                propertyName
              )
            ) {
              const propertyOptions = character.properties[propertyName];

              const filter = filters.find((f) => f.name === propertyName);

              if (filter) {
                for (const option of propertyOptions) {
                  const filterOptions = filter.options;

                  const filterOption = filter.options.find(
                    (fo) => fo.name === option
                  );

                  if (filterOption) {
                    filterOption.count++;
                  } else {
                    filterOptions.push({
                      name: option,
                      count: 1,
                    });
                  }
                }

                continue;
              }

              filters.push({
                name: propertyName,
                options: propertyOptions.map((po) => ({ name: po, count: 1 })),
              });
            }
          }
        }

        return filters;
      })
    );
  }
}
