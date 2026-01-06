/**
 * Supported field types for calculator inputs.
 */
export type FieldType = 'number' | 'list' | 'select' | 'text';

/**
 * Configuration for a single calculator input field.
 */
export interface FieldConfig {
    key: string;
    label: string;
    type: FieldType;
    defaultValue?: unknown;
    placeholder?: string;
    prefix?: string;
    suffix?: string;
    options?: { label: string; value: string }[];
    required?: boolean;
    min?: number;
    max?: number;
    description?: string;
    group?: string;
}

/**
 * Data structure for calculator input values.
 * Keys correspond to FieldConfig keys.
 */
export type CalculatorData = Record<string, number | string | number[] | undefined>;

/**
 * Possible return types from calculator result calculations.
 */
export type ResultValue = number | string | Record<string, unknown>[];

/**
 * Display format types for calculator results.
 */
export type ResultType = 'currency' | 'percent' | 'number' | 'text' | 'table';

/**
 * Column configuration for table-type results.
 */
export interface TableColumn {
    header: string;
    key: string;
    format?: 'currency' | 'percent' | 'number' | 'text';
    align?: 'left' | 'right' | 'center';
}

/**
 * Configuration for a calculator result output.
 */
export interface ResultConfig<T = ResultValue> {
    label: string;
    type: 'currency' | 'percent' | 'number' | 'amortization' | 'black-scholes' | 'dupont' | 'table';
    themeColor?: string;
    tableConfig?: {
        columns: TableColumn[];
    };
    calculate: (data: CalculatorData) => T;
}

/**
 * Basic metadata for a calculator (used in lists/previews).
 */
export interface CalculatorDef {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
}

/**
 * Complete configuration for a calculator including all fields and calculation logic.
 */
export interface CalculatorConfig extends CalculatorDef {
    subtitle?: string;
    formula?: string;
    insights?: string;
    fields: FieldConfig[];
    results: ResultConfig[];
}
