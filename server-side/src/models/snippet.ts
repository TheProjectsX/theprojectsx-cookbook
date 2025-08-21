import { model, Schema, Types } from "mongoose";

const snippetSchema = new Schema(
    {
        user: { type: Types.ObjectId, ref: "User", required: true },
        title: { type: String, required: true },
        snippet: { type: String, required: true },
    },
    { timestamps: true }
);

export const SnippetModel = model("Snippet", snippetSchema);
