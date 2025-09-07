import { model, Schema } from "mongoose";

const avatarSchema = new Schema({
    url: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
});

export const AvatarModel = model("Avatar", avatarSchema);
