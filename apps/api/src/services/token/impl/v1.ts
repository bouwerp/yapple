import { RoleType } from '@repo/model';
import * as jose from 'jose';
import { GenerateTokenInput, GenerateTokenOutput, TokenService, VerifyTokenInput, VerifyTokenOutput } from "..";

export class V1TokenServiceDeps {
    jwtSecret!: string;
}

export class V1TokenService implements TokenService {
    private readonly jwtSecret: string;

    constructor(deps: V1TokenServiceDeps) { 
        this.jwtSecret = deps.jwtSecret;
    }

    async generateToken(input: GenerateTokenInput): Promise<GenerateTokenOutput> {
        const secret = jose.base64url.decode(this.jwtSecret)
        const token = await new jose.EncryptJWT({})
          .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
          .setIssuedAt()
          .setSubject(input.email)
          .setIssuer('yapple')
          .setAudience('yapple')
          .setExpirationTime('2h')
          .encrypt(secret)
        return { token }
    }

    async verifyToken(input: VerifyTokenInput): Promise<VerifyTokenOutput> {
        const secret = jose.base64url.decode(this.jwtSecret)
        const { payload } = await jose.jwtDecrypt(input.token, secret, {
            issuer: 'yapple',
            audience: 'yapple',
        })
        return { email: payload.sub! as RoleType }  
    }   
}
