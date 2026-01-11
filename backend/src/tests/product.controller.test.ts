import { describe, it, expect, mock, beforeEach } from "bun:test";
import { getProducts } from "../controllers/product.controller";
import prisma from "../db/prisma";
import type { Request, Response } from "express";

// Mock dependencies
mock.module("../db/prisma", () => ({
  default: {
    product: {
      findMany: mock(),
      count: mock(),
    },
    $transaction: mock((promises) => Promise.all(promises)),
  },
}));

describe("Product Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    jsonMock = mock(() => {});
    statusMock = mock(() => ({ json: jsonMock }));
    res = {
      status: statusMock,
      json: jsonMock,
    };
    req = {
        query: {}
    };
  });

  describe("getProducts", () => {
    it("should return paginated products", async () => {
      const mockProducts = [
        { id: "p1", name: "Product 1" },
        { id: "p2", name: "Product 2" },
      ];
      const mockTotal = 2;

      (prisma.product.findMany as any).mockResolvedValue(mockProducts);
      (prisma.product.count as any).mockResolvedValue(mockTotal);

      await getProducts(req as Request, res as Response);

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        data: mockProducts,
        meta: expect.objectContaining({
            total: 2,
            page: 1,
            limit: 20
        })
      }));
    });

    it("should filter by search query", async () => {
        req.query = { q: "cream" };

        (prisma.product.findMany as any).mockResolvedValue([]);
        (prisma.product.count as any).mockResolvedValue(0);

        await getProducts(req as Request, res as Response);

        expect(prisma.product.findMany).toHaveBeenCalledWith(expect.objectContaining({
            where: expect.objectContaining({
                OR: expect.arrayContaining([
                    { name: { contains: "cream", mode: "insensitive" } }
                ])
            })
        }));
    });
  });
});
