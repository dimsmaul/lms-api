import { Optional } from "@nestjs/common";
import { PaginationDto } from "src/utils/dto/pagination.dto";


export class CourseListDto extends PaginationDto {
    @Optional()
    type?: 'my-participant' | 'my-trainer' | 'all-courses' = 'all-courses';
}