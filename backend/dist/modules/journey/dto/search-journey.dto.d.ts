declare class PreferencesDto {
    accessible?: boolean;
}
export declare class SearchJourneyDto {
    originStopId: string;
    destinationStopId: string;
    prefs?: PreferencesDto;
}
export {};
