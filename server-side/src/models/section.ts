import { model, Schema } from "mongoose";

const sectionSchema = new Schema({
    title: { type: String },
    content: { type: Schema.Types.Mixed, required: true },
});

export const SectionModel = model("Section", sectionSchema);
