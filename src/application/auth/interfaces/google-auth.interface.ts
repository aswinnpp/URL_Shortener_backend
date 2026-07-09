export interface GoogleUserPayload {
    googleId: string;
    email: string;
    name: string;
    picture?: string;
  }
  
  export interface IGoogleAuthService {
    verifyIdToken(
      idToken: string,
    ): Promise<GoogleUserPayload>;
  }
  
  export const GOOGLE_AUTH_SERVICE =
    Symbol('GOOGLE_AUTH_SERVICE');