import { InjectionToken } from 'injection-js'

export const AUTH_AUDIENCE$$ = new InjectionToken<string>('auth-audience');
export const AUTH_ISSUER$$ = new InjectionToken<string>('auth-issuer');
export const WSTOKEN_SEND_FN$$ = new InjectionToken<any>('current-user_web-socket_sendfn');

