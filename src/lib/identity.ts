export type Avatar = 'dragon'|'phoenix'|'owl'|'book';
export type Identity = { id: string; kind: 'demo'|'legacy'|'student'; label: string; legacyKey?: string; role?: 'student'|'admin'; avatar?: Avatar };
export const demoIdentity: Identity={id:'demo',kind:'demo',label:'Visitante'};
