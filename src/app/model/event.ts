export interface Event {
    id?: string;
    name: string;
    description: string;
}

export interface Solicitation {
    id: string;
    personId: string;
    _personName: string;
}
