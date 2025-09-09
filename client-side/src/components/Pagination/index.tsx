import { MdArrowBackIosNew, MdArrowForwardIos } from "react-icons/md";
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
}: {
    currentPage: number;
    onPageChange: (page: number) => void;
    totalPages: number;
    navigation?: "icons" | "label" | "icons-and-label" | "none";
    hideNumbers?: boolean;
}) => {
    return (
        <div className="flex items-center">
            {/* Previous Button */}
            {navigation !== "none" && (
                <button
                    className="pagination--nav pagination--nav-previous"
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                >
                    {(navigation === "icons-and-label" ||
                        navigation === "icons") && <MdArrowBackIosNew />}
                    {(navigation === "icons-and-label" ||
                        navigation === "label") &&
                        "Previous"}
                </button>
            )}

            {/* Numbers */}
            {!hideNumbers &&
                rangeAround(currentPage, 2, totalPages).map((page) => (
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
                        navigation === "icons") && <MdArrowForwardIos />}
                </button>
            )}
        </div>
    );
};

export default Pagination;
