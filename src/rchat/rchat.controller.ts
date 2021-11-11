import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { RchatService } from './rchat.service';

@Controller('rchat')
export class RchatController {

    constructor(
        private rchatService: RchatService
    ) { }
    
    @Post()
    @HttpCode(200)
    async sendMessage(@Body() data: object) {
        this.rchatService.sendMessage(data);
    }
}
