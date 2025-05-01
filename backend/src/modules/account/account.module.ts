import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { Account, AccountSchema } from '../../schemas/account.schema';
import { AuthGuard } from '../../common/guards/auth.guard';
import { UploadService } from '../upload/upload.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Account.name, schema: AccountSchema }]),
  ],
  controllers: [AccountController],
  providers: [AccountService, AuthGuard, UploadService],
  exports: [AccountService],
})
export class AccountModule {}
