import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dtos/update-user.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private userService: UsersService,
        private authSrvic: AuthService
    ) { }


    @Post('/signup')
    createUser(@Body() body: CreateUserDto) {
        return this.authSrvic.signUp(body.email, body.password);
    }

    @Post('/signin')
    signIn(@Body() body: CreateUserDto) {
        return this.authSrvic.signIn(body.email, body.password);
    }

    // @UseInterceptors(new SerializeInterceptor(UserDto))
    // @Serialize(UserDto)
    @Get('/:id')
    async findUser(@Param('id') id: string) {

        console.log('handler is running');
        const user = await this.userService.findOne(parseInt(id));

        if(!user)
            throw new NotFoundException('user not found');

        return user;
    }

    @Get()
    findAllUser(@Query('email') email: string) {
        return this.userService.find(email);
    }

    @Delete('/:id')
    removeUser(@Param('id') id: string) {
        return this.userService.remove(parseInt(id));
    }

    @Patch('/:id')
    updateUser(@Param('id') id:string, @Body() body:UpdateUserDto){
        return this.userService.update(parseInt(id), body);
    }


}
