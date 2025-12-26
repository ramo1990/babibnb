export interface RegisterFormValues {
    name: string
    email: string
    password: string
  }

export interface LoginFormValues {
  email: string
  password: string
}

export interface CurrentUserType {
  id: string
  email: string
  name: string
  image: string | null
  favoriteIds: string[];
}

export interface OwnerType {
  id: string
  email: string
  name: string
  image: string | null
}

// Type de listing
export interface ListingType {
  id: string
  title: string
  description: string
  categories: string[]
  country_label: string
  country_code: string
  country_flag: string
  country_region: string
  country_lat: number
  country_lng: number
  city_name: string | null
  city_lat: number | null
  city_lng: number | null
  guest_count: number
  room_count: number
  bathroom_count: number
  images: string[]
  price: number
  created_at: string
  owner: OwnerType
}

// Type reservation
export interface Reservation {
  id: string
  userId: string
  listingId: string
  startDate: string
  endDate: string
  totalPrice: number
  created_at: string
}
