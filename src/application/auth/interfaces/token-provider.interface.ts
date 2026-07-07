export interface ITokenProvider {
    generateToken(payload: object): Promise<string>;
  
    verifyToken(token: string): Promise<any>;
  }