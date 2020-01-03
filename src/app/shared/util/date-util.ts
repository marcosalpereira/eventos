import * as moment from 'moment';

export function today(): Date {
    return moment().startOf('day').toDate();
}

export function formatHHMM(d: Date) {
    return lpadMask('00', d.getHours()) + ':' + lpadMask('00', d.getMinutes());
}

export function toDate(hhmm: string): Date {
    const m = moment(hhmm, 'HH:mm');

    return m.toDate();
}

function lpadMask(mask: string, value: any): string {
    return ((mask + value).slice(-mask.length));
}
