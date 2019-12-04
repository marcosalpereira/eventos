import { Evento } from './evento';
import { RecursoParticipacao } from './recurso-participacao';

export interface Participacao {
    evento: Evento,
    recursos?: RecursoParticipacao[]
}
