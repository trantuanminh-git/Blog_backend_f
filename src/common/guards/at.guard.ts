import { AuthGuard } from '@nestjs/passport';

export class AtGuard extends AuthGuard('myjwt') {
  constructor() {
    super(); // when extends sthg, we will call super()
  }
}
