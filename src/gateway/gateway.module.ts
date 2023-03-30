import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { BlogModule } from 'src/blog/blog.module';
import { NotificationGateway } from 'src/gateway/notificationGateway';
import { Module } from '@nestjs/common';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationModule } from 'src/notification/notification.module';

@Module({
  imports: [
    BlogModule,
    UserModule,
    NotificationModule,
    JwtModule.register({
      secret: 'secret-key',
      signOptions: { expiresIn: '3600s' },
    }),
  ],
  controllers: [],
  providers: [NotificationGateway],
})
export class GatewayModule {}
