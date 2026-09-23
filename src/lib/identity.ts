export type Identity = { id: string; kind: 'demo'|'legacy'|'student'; label: string; legacyKey?: string; role?: 'student'|'admin' };
export const demoIdentity: Identity={id:'demo',kind:'demo',label:'Visitante'};
