import { ObjectId } from "mongodb";
import { convertIds } from "../helpers";

test("convertIds", () => {
    const filter = { id: "655f5b5b5b5b5b5b5b5b5b5b" };
    const result = convertIds(filter);
    expect(result).toEqual({ _id: ObjectId.createFromHexString("655f5b5b5b5b5b5b5b5b5b5b") });
});