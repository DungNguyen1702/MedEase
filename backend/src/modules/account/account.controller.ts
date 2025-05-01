import { Multer } from 'multer';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { CreateAccountDto } from './dto/create-account.dto';
import { RoleGuard } from '../../common/guards/role.guard';
import { AccountRoleEnum } from '../../common/enums';
import { AuthGuard } from '../../common/guards/auth.guard';
import { CurrentAccount } from '../../common/decorators/current-account.decorator';
import { Account } from '../../schemas';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from '../upload/upload.service';
import { UpdateAccountDto } from './dto/update-account.dto';

@Controller('accounts')
export class AccountController {
  constructor(
    private readonly accountService: AccountService,
    private readonly uploadService: UploadService
  ) {}

  @Post()
  async create(@Body() createAccountDto: CreateAccountDto) {
    return this.accountService.create(createAccountDto);
  }

  @Get()
  async findAll() {
    return this.accountService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.accountService.findOne(id);
  }

  @Delete(':id')
  async delete(@Param('id') id: string) {
    return this.accountService.delete(id);
  }

  @UseGuards(new RoleGuard([AccountRoleEnum.PATIENT]))
  @UseGuards(AuthGuard)
  @Put()
  @UseInterceptors(FileInterceptor('avatar'))
  async update(
    @CurrentAccount() CurrentAccount: Account,
    @Body() updateAccountDto: UpdateAccountDto,
    @UploadedFile() file: Multer.File
  ) {
    console.log(file)
    if (file) {
      const uploadResult = await this.uploadService.uploadImage(file);
      updateAccountDto.avatar = uploadResult.url;
    }

    return this.accountService.update(CurrentAccount._id, updateAccountDto);
  }

  @UseGuards(AuthGuard)
  @Put('/change-password')
  async changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Body('confirmPassword') confirmPassword: string,
    @CurrentAccount() account: Account
  ) {
    const result = await this.accountService.changePassword(
      account,
      oldPassword,
      newPassword,
      confirmPassword
    );
    return {
      message: 'Password changed successfully',
      result,
    };
  }
}
