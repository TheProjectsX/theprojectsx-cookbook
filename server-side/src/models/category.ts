import { model, Schema } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        tags: {
            type: Object,
            default: [],
        },
    },
    { timestamps: true }
);

export const CategoryModel = model("category", categorySchema);
