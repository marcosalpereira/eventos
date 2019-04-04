import { BaseModel, Named } from './base-model';
import { Recurso } from './recurso';

export interface Evento extends BaseModel, Named {
    descricao: string;
    recursos?: Recurso[];
}
