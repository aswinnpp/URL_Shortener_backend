export interface ITokenHasher {
    hash(token: string): Promise<string>;
  
    compare(
      token: string,
      hash: string,
    ): Promise<boolean>;
  }
  
  export const TOKEN_HASHER = 'TOKEN_HASHER';
