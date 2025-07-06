import { promises as fs } from 'fs';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductRequest } from './dto/create-product-request';
import { PrismaService } from 'src/prisma/prisma.service';
import { join } from 'path';
import { PRODUCT_IMAGES } from './product-images';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ProductsService {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(data: CreateProductRequest, userId: number) {
    return await this.prismaService.product.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async getProducts() {
    const products = await this.prismaService.product.findMany();
    return Promise.all(
      products.map(async (product) => ({
        ...product,
        imageExist: await this.imageExist(product.id),
      })),
    );
  }

  async getProduct(productId: number) {
    try {
      return {
        ...(await this.prismaService.product.findUniqueOrThrow({ where: { id: productId } })),
        imageExist: await this.imageExist(productId),
      };
    } catch (err) {
      throw new NotFoundException(`Product not found with ID ${productId}`);
    }
  }

  async update(productId: number, data: Prisma.ProductUpdateInput) {
    await this.prismaService.product.update({ where: { id: productId }, data });
  }

  private async imageExist(productId: number) {
    try {
      await fs.access(join(`${PRODUCT_IMAGES}/${productId}.png`), fs.constants.F_OK);
      return true;
    } catch (err) {
      return false;
    }
  }
}
