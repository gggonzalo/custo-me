export interface Property {
  name: string;
  value: string;
}

export interface Character {
  name: string;
  show: string;
  image: string;
  bgColor: string;
  properties: Property[];
}
