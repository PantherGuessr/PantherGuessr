import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    levels: defineTable({
        title: v.string(),
        latitude: v.float64(),
        longitude: v.float64(),
        imageId: v.id("_storage"),
    }),
});