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
    category: z.string().optional(),
    tag: z.string().optional(),
    title: z.string(),
});

export const updateGuideSchema = z.object({
    title: z.string().optional(),
});

// Guide Section validators
export const createSectionSchema = z.object({
    title: z.string().min(5).optional(),
    content: z.union([
        z.record(z.string(), z.any()),
        z.array(z.record(z.string(), z.any())),
    ]),
});

export const updateSectionSchema = z.object({
    title: z.string().min(5).optional(),
    content: z
        .union([
            z.record(z.string(), z.any()),
            z.array(z.record(z.string(), z.any())),
        ])
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
