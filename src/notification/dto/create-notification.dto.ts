import { IsNotEmpty } from "class-validator";
import { NotificationType } from "../entities/notification.entity";
export class CreateNotificationDto {
    @IsNotEmpty()
    type: NotificationType;

    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    userId: number;
  
    @IsNotEmpty()
    blogId: number;
}