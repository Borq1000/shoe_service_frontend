export interface Service {
  id: number;
  name: string;
  description: string;
  price: number;
  slug: string;
  image?: string;
}

export interface ServiceResponse {
  data: Service;
  error?: string;
}

export interface ServiceListResponse {
  data: Service[];
  error?: string;
}
