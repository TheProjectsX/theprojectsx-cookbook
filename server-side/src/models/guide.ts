import { model, Schema } from "mongoose";

const guideSchema = new Schema(
    {
        category: {
            type: String,
            required: true,
        },
        tag: {
            type: String,
            required: true,
        },
        title: { type: String, required: true },
        content: { type: Object, required: true },
    },
    { timestamps: true }
);

export const GuideModel = model("Guide", guideSchema);
