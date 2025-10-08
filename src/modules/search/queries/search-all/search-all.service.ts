import { Injectable } from '@nestjs/common';
import { PrismaSearchRepository } from '../../database/search.repository';

@Injectable()
export class AllSearchService {
  constructor(private readonly searchRepo: PrismaSearchRepository) {}

  async execute(query: string) {
    const lowerQuery = query.toLowerCase();

    // 1️⃣ Search products
    const products = await this.searchRepo.searchProjects(lowerQuery);

    // 2️⃣ Search projects
    const projects = await this.searchRepo.searchProjects(lowerQuery);

    // 3️⃣ Search labeled images
    const images = await this.searchRepo.searchImagesByLabel(lowerQuery);

    return { products, projects, images };
  }
}
