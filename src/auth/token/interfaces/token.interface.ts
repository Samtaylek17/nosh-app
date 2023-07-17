export interface jwtTokensInterface {
  accessToken: string;
  refreshToken: string;
}

export interface PayloadTokenInterface {
  userId: string;
  iat: number;
  exp: number;
}
