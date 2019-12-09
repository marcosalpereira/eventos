import { Participation } from './participation';

export interface ResourceGroup {
    id: string;
    name: string;
}

export interface Resource {
    id: string;
    name: string;
    meta: number;
    unit: string;
}

export interface Arrecadation {
    name: string;
    total: number;
}
export interface ParticipationVO extends Resource {
    amount?: number;
}

export interface ResourceGroupVO extends ResourceGroup {
    participations: ParticipationVO[];
}
