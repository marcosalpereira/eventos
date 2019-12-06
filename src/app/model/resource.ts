import { Participation } from './participation';

export interface ResourceGroup {
    id: string;
    name: string;
}

export interface Resource {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

export interface ResourceGroupParticipations extends ResourceGroup {
    participations: Participation[];
}
