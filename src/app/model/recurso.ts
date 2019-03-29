import { BaseModel } from './base-model';

export interface Recurso extends BaseModel {
    nome: string;
    quantidade: number;
    unidade: string;
}
