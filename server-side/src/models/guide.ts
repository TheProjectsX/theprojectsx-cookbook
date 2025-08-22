import { model, Schema, Types } from "mongoose";

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
        sections: [{ type: Types.ObjectId, ref: "Section" }],
    },
    { timestamps: true }
);

export const GuideModel = model("Guide", guideSchema);
