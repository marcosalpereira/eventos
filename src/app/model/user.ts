export interface User {
  uid: string;
  displayName: string;
  email: string;
  photoURL: string;
  admin?: boolean;
  eventsId?: string[];
}

export enum PersonEventStatus {
  PENDING = 'PENDING',
  GRANTED = 'GRANTED'
}

export interface PersonEvent {
  eventId: string;
  status: PersonEventStatus;
}
