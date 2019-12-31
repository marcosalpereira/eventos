export interface Survey {
    id?: string;
    name: string;
    maxAnswers: number;
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

