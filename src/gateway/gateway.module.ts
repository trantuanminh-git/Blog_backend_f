import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { BlogModule } from 'src/blog/blog.module';
import { NotificationGateway } from 'src/gateway/notificationGateway';
import { Module } from '@nestjs/common';

@Module({
  imports: [BlogModule, UserModule,
    JwtModule.register({
      secret: 'secret-key',
      signOptions: { expiresIn: '3600s' },
    }),],
  controllers: [],
  providers: [NotificationGateway]
})
export class GatewayModule {}
