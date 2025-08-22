import { model, Schema } from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
        },
        tags: [
            {
                type: String,
            },
        ],
    },
    { timestamps: true }
);

export const CategoryModel = model("Category", categorySchema);
