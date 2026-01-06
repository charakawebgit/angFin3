export const asList = (val: unknown): (string | number)[] => {
    if (Array.isArray(val)) return val as (string | number)[];
    return [];
};

export const castToNumber = (val: unknown): number => {
    const num = Number(val);
    return isNaN(num) ? 0 : num;
};

export const castToArray = (val: unknown): Record<string, unknown>[] => {
    if (Array.isArray(val)) return val as Record<string, unknown>[];
    return [];
};
