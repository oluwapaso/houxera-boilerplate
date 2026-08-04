export type APIResponseProps = {
    message: string
    data?: any
    success?: boolean
  }
  
  export type Topics = {
    topic_id: number
    title: string
    slug: string
    category_id: number
    published_body: string
    draft_body: string
    excerpt: string
    status: string
    date_added: string
    total_records: number
}

export type submenuProps = {
    title: string,
    link: string,
}

export type MenuProps = {
    title: string, 
    submenu: boolean,
    slug: string
    submenuItems: submenuProps[]
}

export type LangContextType = {
    openedLibrary: string,
    setOpenedLibrary: React.Dispatch<React.SetStateAction<string>>,
}

export type KnowledgeBaseCategories = {
  category_id: number
  name: string
  slug: string
  number_of_topics: number
  total_records: number
}

export type OptionsType = {
    name: string;
    code: string;
    group?: string;
    descriptions?: string;
}

export type ThemeStateProps = {
    theme_settings?: any 
    theme_uid?: string 
    error?: string
    settLoaded?: boolean
}

export type BrokerInfoProp = {
    broker_info?: any 
}

export type UserStateProps = {
    session_id?: string
    access_token?: string
    access_token_expires_in: number 
    user_info?: UserInfo 
    data_counts: any 
    favorites: any[]
    tours: any[]
    isLogged: boolean
    isLogginIn: boolean
    showPageLoader: boolean 
    error?: string
    logged_in_as?: string
    logged_in_by?: string 
    auth_modal?: any,
    prop_modal?: any,
    photo_modal?: any,
}

export type UserInfo = {
  user_id: number;
  user_uid?: string | null;
  company_id?: string | null;
  company_uid?: string | null;
  email?: string | null;
  secondary_email?: string | null;
  firstname?: string | null;
  lastname?: string | null;
  phone_1?: string | null;
  phone_2?: string | null;
  work_phone?: string | null;
  street_address?: string | null;
  city?: string | null;
  state?: string | null;
  zip?: string | null;
  country?: string | null;
  price_range?: string | null;
  spouse_name?: string | null;
  profession?: string | null;
  birthday?: string | null;
  source?: string | null;
  date_added?: string | null;
  facebook?: string | null;
  instagram?: string | null;
  linkedin?: string | null;
  tiktok?: string | null;
  twitter?: string | null;
  whatsapp?: string | null;
  background?: string | null; 
  sub_to_updates?: string | null;
  sub_to_mailing_lists?: string | null;   
  status?: 'Active' | 'Inactive' | 'Reset Password' | 'Deleted';  
  lead_stage?: string | null;
  last_seen?: string | null; 
};

export type MlsSearchQuery = {
  pagination: {
    page: number
    per_page: number
  }

  sort: {
    field: string
    order: "asc" | "desc"
  }

  location?: {
    type?: string
    location?: string
    country?: string
    state?: string
    city?: string
    area?: string
    zip?: string
    geo?: {
      lat: number
      lng: number
      radius_km: number
    }
  }

  price?: {
    min?: number
    max?: number
  }

  beds?: string   // "2", "2+", "3+"
  baths?: string  // same idea

  property: {
    type?: string[]      // Residential, Commercial, etc
    sub_type?: string[]  // Duplex, Apartment, etc
    status?: string[]    // Active, Pending, Off-Market
  }

  features?: {
    parking?: boolean
    pool?: boolean
    furnished?: boolean
    new_construction?: boolean
  }

  area_sqft?: {
    min?: number
    max?: number
  }

  year_built?: {
    min?: number
    max?: number
  }

  keywords?: string

  flags?: {
    verified_only?: boolean
    mls_only?: boolean
  }
}

export const DEFAULT_SEARCH: MlsSearchQuery = {
    pagination: {
        page: 1,
        per_page: 20,
    },
    sort: {
        field: "date_added",
        order: "desc",
    },
    property: {
        status: ["Active"],
    },
}


export type BlogPost = {
    post_uid: string
    company_uid: string
    title: string
    slug: string
    category_uid: string
    category_name: string
    summary: string
    post_body: string
    header_image_large: string
    header_image_small: string
    clicks: number
    views: number
    comments: number
    channels: string[]
    date_added: string
}

export type Neighorhood = {
  neighborhood_uid: string
  company_uid: string
  title: string
  excerpt: string
  slug: string
  header_image_large:string
  header_image_small: string
  views: number
  comments: number
}

export type OurService = {
  service_uid: string
  company_uid: string
  title: string
  excerpt: string
  slug: string
  icon: string
  featured:string
  header_image_large:string
  header_image_small: string
  descriptions: string
  date_added: string
  last_updated_on: string
}