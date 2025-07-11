import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SocialNetworkService } from './social-network.service';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';

@Controller('social-network')
export class SocialNetworkController {
  constructor(private readonly socialNetworkService: SocialNetworkService) {}

  @Post()
  create(@Body() createSocialNetworkDto: CreateSocialNetworkDto) {
    return this.socialNetworkService.create(createSocialNetworkDto);
  }

  @Get()
  findAll() {
    return this.socialNetworkService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.socialNetworkService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSocialNetworkDto: UpdateSocialNetworkDto) {
    return this.socialNetworkService.update(+id, updateSocialNetworkDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.socialNetworkService.remove(+id);
  }
}
