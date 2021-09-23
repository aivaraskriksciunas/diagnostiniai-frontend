export interface SchoolYearModel {
    id: number,
    start_date: Date,
    end_date: Date,
    trimesters: TrimesterModel[],
    human_readable_name: string,
}

export interface TrimesterModel {
    id: number,
    start_date: Date,
    end_date: Date,
    year: SchoolYearModel,
    order?: number,
    human_readable_name: string,
}
