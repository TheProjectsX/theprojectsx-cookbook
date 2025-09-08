import { PipelineStage } from "mongoose";

// This pipeline gets the target doc filtered by category and tag + extracts previous and next doc of the current. As well as populates the sections data from sections
export const getGuidePagePipeline = (
    category: string,
    tag: string
): PipelineStage[] => [
    // Start with all docs in the category
    { $match: { category: { $regex: category, $options: "i" } } },

    {
        $facet: {
            current: [
                { $match: { tag: { $regex: `^${tag}$`, $options: "i" } } }, // now current = category + tag
                { $limit: 1 },
            ],
            allCategoryDocs: [
                {
                    $project: {
                        _id: 1,
                        createdAt: 1,
                        category: 1,
                        tag: 1,
                        title: 1,
                    },
                },
            ],
        },
    },

    {
        $unwind: "$current",
    },

    // Compute prev and next based on current.createdAt
    {
        $addFields: {
            prev: {
                $arrayElemAt: [
                    {
                        $filter: {
                            input: "$allCategoryDocs",
                            as: "doc",
                            cond: {
                                $lt: ["$$doc.createdAt", "$current.createdAt"],
                            },
                        },
                    },
                    -1,
                ],
            },
            next: {
                $arrayElemAt: [
                    {
                        $filter: {
                            input: "$allCategoryDocs",
                            as: "doc",
                            cond: {
                                $gt: ["$$doc.createdAt", "$current.createdAt"],
                            },
                        },
                    },
                    0,
                ],
            },
        },
    },

    // Merge current with prev and next
    {
        $project: {
            doc: {
                $mergeObjects: [
                    "$current",
                    { prev: "$prev" },
                    { next: "$next" },
                ],
            },
        },
    },

    { $replaceRoot: { newRoot: "$doc" } },

    // Populate sections
    {
        $lookup: {
            from: "sections",
            let: { sectionIds: "$sections" },
            pipeline: [
                { $match: { $expr: { $in: ["$_id", "$$sectionIds"] } } },
                { $project: { _id: 1, title: 1, content: 1 } },
            ],
            as: "sectionsData",
        },
    },
    {
        $addFields: {
            sections: {
                $map: {
                    input: "$sections",
                    as: "id",
                    in: {
                        $arrayElemAt: [
                            {
                                $filter: {
                                    input: "$sectionsData",
                                    cond: { $eq: ["$$this._id", "$$id"] },
                                },
                            },
                            0,
                        ],
                    },
                },
            },
        },
    },
    { $project: { sectionsData: 0 } },
];

// Get Counts, Admin Pipeline
export const getCountOverviewPipeline = (): PipelineStage[] => [
    {
        $facet: {
            guides: [{ $count: "count" }],
            categories: [{ $count: "count" }],
            sections: [{ $count: "count" }],
            snippets: [{ $count: "count" }],
            users: [{ $count: "count" }],
        },
    },
];

// Get Guides by Category Count, Admin Pipeline
export const getGuideByCatPipeline = (): PipelineStage[] => [
    {
        $group: {
            _id: "$category",
            count: { $sum: 1 },
        },
    },
    {
        $project: {
            _id: 0,
            category: "$_id",
            count: 1,
        },
    },
];

// Get users with Snippet Count
export const getUsersPipeline = (): PipelineStage[] => [
    { $project: { password: 0 } },
    { $sort: { createdAt: -1 } },

    {
        $lookup: {
            from: "snippets",
            localField: "_id",
            foreignField: "user",
            as: "snippets",
        },
    },

    {
        $addFields: {
            snippetCount: { $size: "$snippets" },
        },
    },

    { $project: { snippets: 0 } },
];
