// Capitalize Text
export const capitalizeText = (text: string) => {
    return text
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
};

// From {Key: Val} to {label: Key, value: Val}[]
export const objToArray = (obj: Record<any, any>) => {
    return Object.entries(obj).map(([key, value]) => ({
        label: key,
        value: value,
    }));
};
