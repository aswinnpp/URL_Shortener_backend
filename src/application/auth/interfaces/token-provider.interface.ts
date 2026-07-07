export interface ITokenProvider {
  generateAccessToken(payload: object): Promise<string>;

  verifyAccessToken(token: string): Promise<any>;
}

export const TOKEN_PROVIDER = 'TOKEN_PROVIDER';