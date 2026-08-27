export interface Attraction {
    id: string;
    name: string;
    category: string;
    city: string;
    tagline: string;
    image: string;
    pubDuration: string;
    pubCost: number;
    taxiDuration: string;
    taxiCost: number;
    co2SavedKg: number;
    description: string;
    guidedSteps: Array<{
        stepNum: number;
        title: string;
        detail: string;
        duration: string;
    }>;
}
export declare class VisitorService {
    getAttractions(category?: string): Promise<Attraction[]>;
    getAttractionDetail(id: string): Promise<Attraction>;
}
