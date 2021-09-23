export interface IEditCourseGroup {
    id?: number;
    name: string,
    head_teacher: number,
    trimester: number,
    subject: string
}

export interface CourseGroupModel {
    id: number;
    name: string,
    head_teacher: number,
    trimester: number,
    subject: ICourseGroupSubject
}

export interface ICourseGroupSubject {
    id: number | string,
    name: string
}

export interface CourseGroupDetailModel {
    id: number,
    name: string,
    head_teacher: number,
    subject: ICourseGroupSubject,
    students: CourseGroupStudent[],
    trimester: number,
}

export interface CourseGroupStudent {
    id: number,
    first_name: string,
    last_name: string
}