
export enum RoleType {
    ADMIN = "ADMIN",
    USER = "USER",
}

export class Role {
    name!: string;
    type!: RoleType;
    groupId!: string;
}
        
