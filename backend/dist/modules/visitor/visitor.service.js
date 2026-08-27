var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
const VISITOR_ATTRACTIONS = [
    {
        id: "attr-1",
        name: "Shore Temple & Pancha Rathas",
        category: "Heritage",
        city: "Mahabalipuram",
        tagline: "UNESCO 8th-century granite monuments overlooking the Bay of Bengal",
        image: "🛕",
        pubDuration: "1h 40m",
        pubCost: 120,
        taxiDuration: "1h 50m",
        taxiCost: 1800,
        co2SavedKg: 5.4,
        description: "Built during the reign of Narasimhavarman II, this coastal structural temple complex is an architectural marvel of Southern India.",
        guidedSteps: [
            { stepNum: 1, title: "Board Express Bus 588", detail: "Depart from CMBT Koyambedu Bay 4 direct along East Coast Road", duration: "1h 10m" },
            { stepNum: 2, title: "Transfer to Local E-Shuttle", detail: "Board green electric shuttle at Mahabalipuram Bus Stand", duration: "15 min" },
            { stepNum: 3, title: "Arrival at Shore Temple", detail: "Scan your TransitOne universal QR code at ticket turnstile gate", duration: "15 min" }
        ]
    },
    {
        id: "attr-2",
        name: "Taj Mahal Complex",
        category: "Heritage",
        city: "Agra",
        tagline: "Iconic ivory-white marble mausoleum on Yamuna riverbank",
        image: "🕌",
        pubDuration: "2h 10m",
        pubCost: 280,
        taxiDuration: "2h 45m",
        taxiCost: 2500,
        co2SavedKg: 8.2,
        description: "An immense mausoleum of white marble, built in Agra between 1631 and 1648 by order of Emperor Shah Jahan.",
        guidedSteps: [
            { stepNum: 1, title: "Take Gatimaan Express", detail: "Board from New Delhi station platform 3 to Agra Cantt", duration: "1h 40m" },
            { stepNum: 2, title: "Electric Auto Shuttle", detail: "Eco-friendly zero-emission electric shuttle direct to Taj West Gate", duration: "20 min" },
            { stepNum: 3, title: "Ticket Scan & Entry", detail: "Scan your TransitOne universal QR code at high-speed turnstiles", duration: "10 min" }
        ]
    },
    {
        id: "attr-3",
        name: "Mysore Palace",
        category: "Culture",
        city: "Mysuru",
        tagline: "Grand royal residence illuminated with 100,000 bulbs",
        image: "🛕",
        pubDuration: "2h 30m",
        pubCost: 190,
        taxiDuration: "3h 00m",
        taxiCost: 2800,
        co2SavedKg: 7.5,
        description: "The official residence of the Wadiyar dynasty, showcasing Indo-Saracenic grandeur.",
        guidedSteps: [
            { stepNum: 1, title: "Vande Bharat Express", detail: "Fast rail connection from KSR Bengaluru to Mysuru Junction", duration: "1h 50m" },
            { stepNum: 2, title: "City Bus Line 201A", detail: "Board right outside main station gate to Palace Circle", duration: "15 min" }
        ]
    },
    {
        id: "attr-4",
        name: "Covelong Beach & Surfing School",
        category: "Beaches",
        city: "Kovalam",
        tagline: "Pristine golden sands & coastal watersports hub",
        image: "🏖️",
        pubDuration: "1h 15m",
        pubCost: 85,
        taxiDuration: "1h 00m",
        taxiCost: 1100,
        co2SavedKg: 3.9,
        description: "Popular beach village famed for surf schools, fishing harbor, and coastal cafes.",
        guidedSteps: [
            { stepNum: 1, title: "Coastal Shuttle Bus 99", detail: "Direct air-conditioned bus along East Coast Road", duration: "60 min" },
            { stepNum: 2, title: "Walk to Beach Promenade", detail: "Follow palm avenue direct to surf station", duration: "15 min" }
        ]
    }
];
let VisitorService = class VisitorService {
    async getAttractions(category) {
        if (!category || category === 'All' || category === '') {
            return VISITOR_ATTRACTIONS;
        }
        return VISITOR_ATTRACTIONS.filter(a => a.category.toLowerCase() === category.toLowerCase());
    }
    async getAttractionDetail(id) {
        const found = VISITOR_ATTRACTIONS.find(a => a.id === id);
        if (!found) {
            return VISITOR_ATTRACTIONS[0];
        }
        return found;
    }
};
VisitorService = __decorate([
    Injectable()
], VisitorService);
export { VisitorService };
//# sourceMappingURL=visitor.service.js.map