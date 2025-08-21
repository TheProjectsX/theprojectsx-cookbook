import { z } from "zod";

// ------- Auth Validators -------
export const registerSchema = z.object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(6),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().min(6),
});

// ------- Data Validators -------

// Guide / Post / Main Content validators
export const createGuideSchema = z.object({
    category: z.string().regex(/^\S+$/, "Category should not contain spaces!"),
    tag: z.string().regex(/^\S+$/, "Tag should not contain spaces!"),
    title: z.string(),
    content: z.union([
        z.record(z.string(), z.any()),
        z.record(z.string(), z.any()),
    ]),
});

export const updateGuideSchema = z.object({
    category: z
        .string()
        .regex(/^\S+$/, "Category should not contain spaces!")
        .optional(),
    tag: z.string().regex(/^\S+$/, "Tag should not contain spaces!").optional(),
    title: z.string().optional(),
    content: z
        .union([z.record(z.string(), z.any()), z.record(z.string(), z.any())])
        .optional(),
});

// Snippet Validators - For User
export const createSnippetSchema = z.object({
    title: z.string().min(4),
    snippet: z.string().min(5),
});

export const updateSnippetSchema = z.object({
    title: z.string().min(4).optional(),
    snippet: z.string().min(5).optional(),
});
