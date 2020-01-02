export interface Survey {
    id?: string;
    name: string;
    maxAnswers: number;
    questions: string;
}

export interface Answers {
    uid: string;
    answers: string;
}

