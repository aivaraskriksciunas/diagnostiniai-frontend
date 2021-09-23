export interface GradeGroupModel {
    grade: number,
    letter: string,
    head_teacher: number,
    school_year: number,
    id?: number,
}

export interface GradeGroupStudent {
    id: number,
    first_name: string,
    last_name: string,
}

export interface GradeGroupDetail {
    id: number,
    grade: number,
    letter: string,
    head_teacher: number,
    school_year: number,
    students: GradeGroupStudent[]
}