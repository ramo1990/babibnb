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
export interface ReservationType {
  id: string
  userId: string
  listingId: string
  listing: ListingType
  startDate: string
  endDate: string
  totalPrice: number
  created_at: string
}

export interface ConversationType { 
  id: string 
  listing: ListingType 
  host: CurrentUserType 
  guest: CurrentUserType 
  lastMessage?: MessageType 
  isHost: boolean 
  created_at: string 
  updated_at: string
} 

export interface MessageType { 
  id: string 
  sender: CurrentUserType 
  content: string 
  created_at: string 
  isMine?: boolean 
  isRead: boolean
}