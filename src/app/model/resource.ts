export interface ResourceGroup {
    id: string;
    name: string;
}

export interface Resource {
    id: string;
    name: string;
    amount: number;
    unit: string;
}

export interface ResourceGroupResources extends ResourceGroup {
    resources: Resource[];
}
