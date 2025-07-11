import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { WaitingListService } from './waitingList.service';
import { CreateWaitingListDto } from './dto/create-waitingList.dto';
import { UpdateWaitingListDto } from './dto/update-waitingList.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('WaitingList')
export class WaitingListController {
  constructor(private readonly WaitingListService: WaitingListService) {}

  @Post("create")
  create(@Body() createWaitingListDto: CreateWaitingListDto) {
    return this.WaitingListService.create(createWaitingListDto);
  }

  @Get()
  findAll() {
    return this.WaitingListService.findAll();
  }
  
	@UseGuards(JwtAuthGuard)
	// @Public()
	@Get('all/:id')
	findAllByUserId(@Param('id') id: string) {
		return this.WaitingListService.findAllByUserId(id);
	}
  
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.WaitingListService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateWaitingListDto: UpdateWaitingListDto) {
    return this.WaitingListService.update(+id, updateWaitingListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.WaitingListService.remove(+id);
  }
}
