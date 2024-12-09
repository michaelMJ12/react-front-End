import { ReactNode } from "react";

export interface Campaign {
    [x: string]: ReactNode;
    id: number;
    name: string;
    from: string;
    to: string;
    daily_budget: number;
    total_budget: number;
    creatives: string[];
}
