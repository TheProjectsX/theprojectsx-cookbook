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
