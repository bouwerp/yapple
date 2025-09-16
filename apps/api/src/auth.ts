import { RoleType } from "@repo/model"
import * as jose from 'jose'

export async function generateToken(email: string): Promise<string> {
    const secret = jose.base64url.decode(process.env.JWT_SECRET!)
    return await new jose.EncryptJWT({ RoleType: RoleType.ADMIN })
      .setProtectedHeader({ alg: 'dir', enc: 'A128CBC-HS256' })
      .setIssuedAt()
      .setSubject(email)
      .setIssuer('yapple')
      .setAudience('yapple')
      .setExpirationTime('2h')
  .encrypt(secret)
}

export async function verifyToken(token: string): Promise<{ email: string, role: RoleType }> {
    const secret = jose.base64url.decode(process.env.JWT_SECRET!)
    const { payload, protectedHeader } = await jose.jwtDecrypt(token, secret, {
        issuer: 'yapple',
        audience: 'yapple',
      })
    return { email: payload.sub!, role: payload.RoleType! as RoleType }   
}   