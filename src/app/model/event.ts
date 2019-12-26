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

export interface Survey {
    id?: string;
    name: string;
}

export interface Question {
    id: string;
    number: number;
    description: string;
}

export interface Answer {
    uid: string;
    questionId: string;
    answer: string;
}

