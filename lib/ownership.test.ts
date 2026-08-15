import { expect, it } from "vitest";
import { ownedMaintenanceWhere, ownedVehicleWhere } from "./ownership";

it("always scopes vehicle access to the authenticated user", () => expect(ownedVehicleWhere("user-a", "vehicle-b")).toEqual({ id: "vehicle-b", userId: "user-a" }));
it("scopes nested maintenance ownership through its vehicle", () => expect(ownedMaintenanceWhere("user-a", "vehicle-b", "item-b")).toEqual({ id: "item-b", vehicleId: "vehicle-b", vehicle: { userId: "user-a" } }));

