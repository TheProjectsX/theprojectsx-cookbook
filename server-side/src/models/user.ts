import { Schema, model } from "mongoose";

export enum Role {
    Admin = "admin",
    User = "user",
    Author = "author",
}

const userSchema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        avatar: { type: String, require: true },
        role: {
            type: String,
            enum: Object.values(Role),
            default: Role.User,
        },
    },
    { timestamps: true }
);

export const UserModel = model("User", userSchema);
