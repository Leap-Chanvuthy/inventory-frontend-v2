export interface AuditUser {
  id: number;
  name: string;
  phone_number?: string | null;
  profile_picture?: string | null;
  role: string;
  email: string;
  email_verified_at?: string | null;
  ip_address?: string | null;
  device?: string | null;
  last_activity?: string | null;
  two_factor_enabled: boolean;
  two_factor_confirmed_at?: string | null;
  created_at: string;
  updated_at: string;
}

export type OldOrNewValues = Record<string, any> | any[];

export interface AuditEntry {
  id: number;
  user_type?: string | null;
  user_id?: number | null;
  event: string;
  auditable_type?: string | null;
  auditable_id?: number | null;
  old_values: OldOrNewValues;
  new_values: OldOrNewValues;
  url?: string | null;
  ip_address?: string | null;
  user_agent?: string | null;
  tags?: string | null;
  created_at: string;
  updated_at: string;
  user?: AuditUser | null;
}

export interface PaginationLink {
  url?: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedAuditResponse {
  current_page: number;
  data: AuditEntry[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: PaginationLink[];
  next_page_url?: string | null;
  path: string;
  per_page: number;
  prev_page_url?: string | null;
  to: number | null;
  total: number;
}

export interface SingleAuditResponse {
  status: boolean;
  message: string;
  data: AuditEntry;
}

export interface QueryAuditsParams {
  page?: number;
  per_page?: number;
  "filter[search]"?: string;
  "filter[id]"?: number;
  "filter[event]"?: string;
  "filter[user_id]"?: number;
  "filter[auditable_type]"?: string;
  "filter[auditable_id]"?: number;
  "filter[date_from]"?: string;
  "filter[date_to]"?: string;
  sort?: string;
}

export type GetAllAuditResponse = PaginatedAuditResponse;
export type GetAuditByIdResponse = SingleAuditResponse;
