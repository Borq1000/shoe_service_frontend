export interface Service {
  id: number;
  slug: string;
  name: string;
  description: string;
  image: string;
  attributes?: ServiceAttribute[];
}

export interface ServiceAttribute {
  id: number;
  name: string;
  options: ServiceOption[];
}

export interface ServiceOption {
  id: number;
  name: string;
  price: number;
}
