import { Module } from '@nestjs/common';
import { RchatController } from './rchat.controller';
import { RchatService } from './rchat.service';

@Module({
  controllers: [RchatController],
  providers: [RchatService]
})
export class RchatModule {}
