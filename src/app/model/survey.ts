import * as firebase from 'firebase/app';
import Timestamp = firebase.firestore.Timestamp;


export interface Survey {
    id?: string;
    name: string;
    maxAnswers: number;
    questions: string;
    expiration: Date | Timestamp;
}

export interface Answers {
    uid: string;
    answers: string;
}

