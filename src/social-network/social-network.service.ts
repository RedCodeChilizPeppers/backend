import { Injectable } from '@nestjs/common';
import { CreateSocialNetworkDto } from './dto/create-social-network.dto';
import { UpdateSocialNetworkDto } from './dto/update-social-network.dto';

@Injectable()
export class SocialNetworkService {
  create(createSocialNetworkDto: CreateSocialNetworkDto) {
    return 'This action adds a new socialNetwork';
  }

  findAll() {
    return `This action returns all socialNetwork`;
  }

  findOne(id: number) {
    return `This action returns a #${id} socialNetwork`;
  }

  update(id: number, updateSocialNetworkDto: UpdateSocialNetworkDto) {
    return `This action updates a #${id} socialNetwork`;
  }

  remove(id: number) {
    return `This action removes a #${id} socialNetwork`;
  }
}
