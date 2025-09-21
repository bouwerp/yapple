import { Condition, Filter, ObjectId, WithId } from "mongodb";

export function convertIds<T>(filter: Filter<T>): Filter<T> {
        for (const key in filter) {
            if (key === "id") {
                filter["_id"] = ObjectId.createFromHexString(filter["id"] as string) as Condition<WithId<T>["_id"]>;
                delete filter['id'];
            }
        }
        return filter;
}