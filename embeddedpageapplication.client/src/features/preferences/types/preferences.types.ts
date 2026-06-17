export type ConsentStatus = 'WITHDRAWN' | 'CONFIRMED';

export interface NotificationOption {
  id: string;
  type: string;
  consented: boolean;
}

export interface CommunicationPreference {
  id: string;
  name: string;
  type: string;
  options: NotificationOption[];
}

export interface OtherPreference {
  id: string;
  name: string;
  type: string;
  options: NotificationOption[];
}

export interface Purpose {
  id: string;
  label: string;
  description: string;
  status: string;
  version: number;
  purposeType: string;
  communicationPreferences: CommunicationPreference[];
  otherPreferences: OtherPreference[];
}

export interface FetchUserPreferencesRequest {
  userId: string;
  collectionPointId: string;
}

export interface UserPreferencesResponse {
  meta: {
    correlationId: string;
  },
  data: Purpose[]
}

export interface AdditionalInfo {
  email: string;
  company: string;
  mobile: string;
}

export interface PurposeUpdate {
  purposeId: string;
  status: ConsentStatus;
  communicationPreferences: string[];
}

export interface UpdateUserPreferencesRequest {
  userId: string;
  collectionPointId: string;
  source: string;
  purposes: PurposeUpdate[];
  additionalInfo?: AdditionalInfo;
}

export interface CommunicationType {
  type: string;
  name: string;
}
