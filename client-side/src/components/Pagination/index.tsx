import "./styles.css";

/**
 * Generates an array of numbers around a given number `num`, including `n` numbers before and after.
 * Ensures the array stays within 1 and `max`, adjusting if the full range of `2n+1` is not possible.
 * If max < 2n+1, returns [1..max].
 */
const rangeAround = (
    num: number,
    n: number,
    max: number = Infinity
): number[] => {
    const fullLength = 2 * n + 1;

    if (max < fullLength) {
        return Array.from({ length: max }, (_, i) => i + 1);
    }

    let start = Math.max(1, num - n);
    let end = Math.min(max, num + n);

    // Adjust if range is smaller than 2n+1
    if (end - start + 1 < fullLength) {
        if (start === 1) {
            end = Math.min(max, start + 2 * n);
        } else if (end === max) {
            start = Math.max(1, end - 2 * n);
        }
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
};

const Pagination = ({
    currentPage = 1,
    onPageChange,
    totalPages,
    navigation = "icons-and-label",
    hideNumbers = false,
    range = 2,
    className = "",
}: {
    currentPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
    navigation?: "icons" | "label" | "icons-and-label" | "none";
    hideNumbers?: boolean;
    range?: number;
    className?: string;
}) => {
    return (
        <div className={`flex items-center ${className}`}>
            {/* Previous Button */}
            {navigation !== "none" && (
                <button
                    className="pagination--nav pagination--nav-previous"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    {(navigation === "icons-and-label" ||
                        navigation === "icons") && (
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fill="none" d="M0 0h24v24H0z"></path>
                            <path d="M17.77 3.77 16 2 6 12l10 10 1.77-1.77L9.54 12z"></path>
                        </svg>
                    )}
                    {(navigation === "icons-and-label" ||
                        navigation === "label") &&
                        "Previous"}
                </button>
            )}

            {/* Numbers */}
            {!hideNumbers &&
                rangeAround(currentPage, range, totalPages).map((page) => (
                    <button
                        key={page}
                        className="pagination--nav pagination--nav-numbers"
                        disabled={currentPage === page}
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </button>
                ))}

            {/* Next Button */}
            {navigation !== "none" && (
                <button
                    className="pagination--nav pagination--nav-next"
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                >
                    {(navigation === "icons-and-label" ||
                        navigation === "label") &&
                        "Next"}
                    {(navigation === "icons-and-label" ||
                        navigation === "icons") && (
                        <svg
                            stroke="currentColor"
                            fill="currentColor"
                            strokeWidth="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                            <path d="M6.23 20.23 8 22l10-10L8 2 6.23 3.77 14.46 12z"></path>
                        </svg>
                    )}
                </button>
            )}
        </div>
    );
};

export default Pagination;
