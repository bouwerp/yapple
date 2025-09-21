import jwt from 'jsonwebtoken';
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
        const token = jwt.sign({}, this.jwtSecret, {
            issuer: 'yapple',
            audience: 'yapple',
            expiresIn: '2h',
            subject: input.email
        })
        return { token }
    }

    async verifyToken(input: VerifyTokenInput): Promise<VerifyTokenOutput> {
        const payload = jwt.verify(input.token, this.jwtSecret, {
            issuer: 'yapple',
            audience: 'yapple',
        })
        console.log(payload);
        return { email: payload.sub! as string }  
    }   
}
