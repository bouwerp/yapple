
export enum RoleType {
    ADMIN = "ADMIN",
    USER = "USER",
}

export class Role {
    type!: RoleType;
    groupId!: string;
}
        
