import { CanActivate, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class WsGuard implements CanActivate {

    constructor(
    private userService: UserService,
    private jwtService: JwtService
    ) {}

    canActivate(
        context: any,
    ): boolean | any | Promise<boolean | any> | Observable<boolean | any> {
        const bearerToken = context.args[0].handshake.headers.authorization;
        try {
            const decoded = this.jwtService.verify(bearerToken, {secret: 'at-secret'});
            return new Promise((resolve, reject) => {
                return this.userService.findOneUserByEmail(decoded?.email).then(user => {
                    if (user) {
                        resolve(user);
                    } else {
                        reject(false);
                    }
                });
             });
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}