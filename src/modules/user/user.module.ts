import { Module, Provider, Type } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../../schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])],
  controllers: [UserController] as Type<any>[],
  providers: [UserService] as Provider[],
  exports: [UserService] as Provider[],
})
export class UserModule {}
