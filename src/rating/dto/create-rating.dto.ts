import { IsNotEmpty } from "class-validator";

export class CreateRatingDto {
    @IsNotEmpty()
    star: number
}
