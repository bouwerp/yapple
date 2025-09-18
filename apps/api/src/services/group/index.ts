import { Group } from "@repo/model";

/**
 * Group service interface
 */
export interface GroupService {
    addGroup(input: AddGroupInput): Promise<AddGroupOutput>;
    getGroupById(input: GetGroupByIdInput): Promise<GetGroupByIdOutput>;
    getGroupByName(input: GetGroupByNameInput): Promise<GetGroupByNameOutput>;
}

/**
 * Input for addGroup
 * @property name - name of the group
 */
export class AddGroupInput {
    name!: string;
}

/**
 * Output for addGroup
 * @property id - id of the group
 */
export class AddGroupOutput {
    id!: string;
}

/**
 * Input for getGroupById
 * @property id - id of the group
 */
export class GetGroupByIdInput {
    id!: string;
}

/**
 * Output for getGroupById
 * @property group - group
 */
export class GetGroupByIdOutput {
    group?: Group;
}

/**
 * Input for getGroupByName
 * @property name - name of the group
 */
export class GetGroupByNameInput {
    name!: string;
}

/**
 * Output for getGroupByName
 * @property group - group
 */
export class GetGroupByNameOutput {
    group?: Group;
}
    