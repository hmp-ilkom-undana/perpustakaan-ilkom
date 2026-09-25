import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { ActivityLogService } from './activity-log.service';
import { GetLogsQueryDto } from './dto/get-logs-query.dto';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('api/activity-logs')
export class ActivityLogController {
  constructor(private readonly activityLogService: ActivityLogService) {}

  @Get('stats')
  @Roles('ADMIN')
  async getStats() {
    return this.activityLogService.getStats();
  }

  @Get()
  @Roles('ADMIN')
  async getLogs(@Query() query: GetLogsQueryDto) {
    return this.activityLogService.getLogs(query);
  }
}
