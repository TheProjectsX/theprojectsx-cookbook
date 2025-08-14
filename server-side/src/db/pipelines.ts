import { PipelineStage } from "mongoose";

// This pipeline gets the target doc filtered by category and tag + extracts previous and next doc of the current
export const getGuidePagePipeline = (
    category: string,
    tag: string
): PipelineStage[] => {
    return [
        { $match: { category, tag } },
        {
            $facet: {
                current: [{ $limit: 1 }],
                prev: [
                    { $sort: { createdAt: -1 } },
                    { $limit: 1 },
                    { $project: { _id: 0, category: 1, tag: 1, title: 1 } },
                ],
                next: [
                    { $sort: { createdAt: 1 } },
                    { $limit: 1 },
                    { $project: { _id: 0, category: 1, tag: 1, title: 1 } },
                ],
            },
        },
        {
            $project: {
                doc: {
                    $mergeObjects: [
                        { $arrayElemAt: ["$current", 0] },
                        { prev: { $arrayElemAt: ["$prev", 0] } },
                        { next: { $arrayElemAt: ["$next", 0] } },
                    ],
                },
            },
        },

        { $replaceRoot: { newRoot: "$doc" } },
    ];
};
