import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SnapshotBlockchainService } from './snapshot-blockchain.service';
import { CreateSnapshotBlockchainDto } from './dto/create-snapshot-blockchain.dto';
import { UpdateSnapshotBlockchainDto } from './dto/update-snapshot-blockchain.dto';

@Controller('snapshot-blockchain')
export class SnapshotBlockchainController {
  constructor(private readonly snapshotBlockchainService: SnapshotBlockchainService) {}

  @Post()
  create(@Body() createSnapshotBlockchainDto: CreateSnapshotBlockchainDto) {
    return this.snapshotBlockchainService.create(createSnapshotBlockchainDto);
  }

  @Get()
  findAll() {
    return this.snapshotBlockchainService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.snapshotBlockchainService.findOne(+id);
  }

  @Patch('updatesnapshot/:id')
  updatesnapshot(@Param('id') id: string, @Body() updateSnapshotBlockchainDto: UpdateSnapshotBlockchainDto) {
    return this.snapshotBlockchainService.update(+id, updateSnapshotBlockchainDto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSnapshotBlockchainDto: UpdateSnapshotBlockchainDto) {
    return this.snapshotBlockchainService.update(+id, updateSnapshotBlockchainDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.snapshotBlockchainService.remove(+id);
  }
}
