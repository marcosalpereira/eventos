import { Participation } from './participation';

export interface ResourceGroup {
    id?: string;
    name: string;
}

export interface Resource {
    id?: string;
    name: string;
    meta: number;
    unit: string;
}

export interface Arrecadation {
    resource: Partial<Resource>;
    total: number;
}
export interface ParticipationVO extends Resource {
    participationId?: string;
    amount?: number;
}

export interface ParticipationsGrouped extends ResourceGroup {
    participations: ParticipationVO[];
}

export interface ResourcesGroupedVO extends ResourceGroup {
    resources: Resource[];
}
