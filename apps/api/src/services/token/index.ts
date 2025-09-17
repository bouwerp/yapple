
export interface TokenService {
    generateToken(input: GenerateTokenInput): Promise<GenerateTokenOutput>;
    verifyToken(input: VerifyTokenInput): Promise<VerifyTokenOutput>;
}

export class GenerateTokenInput {
    email!: string;
}

export class GenerateTokenOutput {
    token!: string;
}

export class VerifyTokenInput {
    token!: string;
}

export class VerifyTokenOutput {
    email!: string;
}