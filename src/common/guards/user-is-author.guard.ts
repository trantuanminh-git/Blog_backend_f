// import { CanActivate, Injectable, ExecutionContext } from '@nestjs/common';

// import { CommentService } from 'src/comment/comment.service';

// @Injectable()
// export class UserIsAuthorGuard implements CanActivate {
//   constructor(private commentService: CommentService) {}

//   async canActivate(context: ExecutionContext) {
//     const request = context.switchToHttp().getRequest();
//     const user = request.user;
//     const params = request.params;
//     if (params.id) {
//       const commentEntryId = Number(params.id);
//       console.log(user);
//       const comment = await this.commentService.findOne(commentEntryId);
//       return comment.userId === user.user_ID;
//     }
//   }
// }
