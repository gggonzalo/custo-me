export interface Option {
  name: string;
  count: number;
}

export interface Filter {
  name: string;
  options: Option[];
}

export interface OptionsSelection {
  [name: string]: boolean;
}

export interface FiltersSelection {
  [name: string]: OptionsSelection;
}

export interface FiltersParams {
  [name: string]: string[];
}
