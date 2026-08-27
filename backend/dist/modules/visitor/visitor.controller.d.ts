import { VisitorService } from './visitor.service.js';
export declare class VisitorController {
    private readonly visitorService;
    constructor(visitorService: VisitorService);
    getAttractions(category?: string): Promise<import("./visitor.service.js").Attraction[]>;
    getAttractionDetail(id: string): Promise<import("./visitor.service.js").Attraction>;
}
