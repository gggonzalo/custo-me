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
    // TODO: See how we can make just 1 request of the characters
    return this.http.get<Character[]>('api/characters/characters.json').pipe(
      map((characters) => {
        const filters: Filter[] = [];

        for (const character of characters) {
          for (const property of character.properties) {
            const filter = filters.find((f) => f.name === property.name);

            if (filter) {
              const filterOptions = filter.options;

              const filterOption = filter.options.find(
                (fo) => fo.name === property.value
              );

              if (filterOption) {
                filterOption.count++;
              } else {
                filterOptions.push({
                  name: property.value,
                  count: 1,
                });
              }

              continue;
            }

            filters.push({
              name: property.name,
              options: [{ name: property.value, count: 1 }],
            });
          }
        }

        return filters;
      })
    );
  }
}
