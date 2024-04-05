import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CoffeeService } from './coffee.service';
import { CreateCoffeeDto } from './dto/create-coffee.dto';
import { UpdateCoffeeDto } from './dto/update-coffee.dto';
import { ActiveUser } from '../iam/decorators/active-user.decorator';
import { ActiveUserData } from '../iam/interfaces/active-user-data.interface';
import { Roles } from '../iam/authorization/decorators/roles.decorator';
import { Role } from 'src/user/enums/role.enum';
import { FrameworkContributorPolicy } from '../iam/authorization/policies/framework-contributor.policy';
import { Policies } from '../iam/authorization/decorators/policies.decorator';
import { AuthType } from '../iam/enums/auth-type';
import { Auth } from '../iam/authentication/decorators/auth.decorator';

@Auth(AuthType.Bearer, AuthType.ApiKey)
@Controller('coffees')
export class CoffeeController {
  constructor(private readonly coffeeService: CoffeeService) {}

  @Policies(new FrameworkContributorPolicy())
  // @Permissions(Permission.CreateCoffee)
  // @Roles(Role.Admin)
  @Post()
  create(@Body() createCoffeeDto: CreateCoffeeDto) {
    return this.coffeeService.create(createCoffeeDto);
  }

  @Get()
  findAll(@ActiveUser() user: ActiveUserData) {
    console.log(user);
    return this.coffeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coffeeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateCoffeeDto: UpdateCoffeeDto) {
    return this.coffeeService.update(+id, updateCoffeeDto);
  }

  @Roles(Role.Admin)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coffeeService.remove(+id);
  }
}
