import { model, Schema } from "mongoose";

const guideSchema = new Schema(
    {
        category: {
            type: String,
            required: true,
            validate: {
                validator: function (v: string) {
                    return /^\S+$/.test(v);
                },
                message: (props: any) =>
                    `${props.value} should not contain spaces!`,
            },
        },
        tag: {
            type: String,
            required: true,
            validate: {
                validator: function (v: string) {
                    return /^\S+$/.test(v);
                },
                message: (props: any) =>
                    `${props.value} should not contain spaces!`,
            },
        },
        title: { type: String, required: true },
        content: { type: Object, required: true },
    },
    { timestamps: true }
);

export const GuideModel = model("Guide", guideSchema);
