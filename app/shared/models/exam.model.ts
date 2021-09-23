
export interface ExamModel {
    id: number,
    name: string,
    max_score: number,
    min_score: number,
    group: number,
    created_at: string,
    updated_at: string,
    taken_at: string,
    owner: number,
    is_diagnostinis: boolean,
};

export interface ExamDetailModel {
    id: number,
    name: string,
    max_score: number,
    min_score: number,
    group: number,
    created_at: string,
    updated_at: string,
    taken_at: string,
    owner: number,
    is_diagnostinis: boolean,
    marks: ExamMarkModel[],
}

export interface ExamMarkModel {
    student: {
        id: number, 
        first_name: string,
        last_name: string
    },
    mark: number
}