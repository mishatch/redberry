export interface Estate {
  address: string;
  agent: {
    avatar: string;
    name: string;
    surname: string;
    id: number;
    phone: string;
    email: string;
  };
  agent_id: number;
  area: number;
  bedrooms: number;
  city: {
    id: number;
    name: string;
    region: {
      id: number;
      name: string;
    };
    region_id: number;
  };
  city_id: number;
  created_at: string;
  description: string;
  id: number;
  image: string;
  is_rental: number;
  price: number;
  zip_code: string;
}
