import { Module } from '@nestjs/common';
import { UtilityService } from './utility.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true
  }), HttpModule],
  providers: [UtilityService],
  exports: [UtilityService, HttpModule],
})
export class UtilityModule {}
