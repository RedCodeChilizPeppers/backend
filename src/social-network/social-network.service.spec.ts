import { Test, TestingModule } from '@nestjs/testing';
import { SocialNetworkService } from './social-network.service';

describe('SocialNetworkService', () => {
  let service: SocialNetworkService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SocialNetworkService],
    }).compile();

    service = module.get<SocialNetworkService>(SocialNetworkService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
