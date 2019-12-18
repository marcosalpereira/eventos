export interface Event {
    id?: string;
    name: string;
    description: string;
}

export interface Solicitation {
    _userId: string;
    _eventId: string;
    _userName: string;
}
