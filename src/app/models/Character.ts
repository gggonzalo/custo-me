export interface Properties {
  [name: string]: string[];
}

export interface Character {
  name: string;
  show: string;
  image: string;
  bgColor: string;
  properties: Properties;
}
