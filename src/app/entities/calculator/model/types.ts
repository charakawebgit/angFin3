export type FieldType = 'number' | 'list' | 'select' | 'text';

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

export type CalculatorData = Record<string, number | string | number[] | undefined>;

export type ResultValue = number | string | Record<string, unknown>[];

export type ResultType = 'currency' | 'percent' | 'number' | 'text' | 'table';

export interface TableColumn {
    header: string;
    key: string;
    format?: 'currency' | 'percent' | 'number' | 'text';
    align?: 'left' | 'right' | 'center';
}

export interface ResultConfig<T = ResultValue> {
    label: string;
    type: 'currency' | 'percent' | 'number' | 'amortization' | 'black-scholes' | 'dupont' | 'table';
    themeColor?: string;
    tableConfig?: {
        columns: TableColumn[];
    };
    calculate: (data: CalculatorData) => T;
}

export interface CalculatorDef {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: string;
}

export interface CalculatorConfig extends CalculatorDef {
    subtitle?: string;
    formula?: string;
    insights?: string;
    fields: FieldConfig[];
    results: ResultConfig[];
}
