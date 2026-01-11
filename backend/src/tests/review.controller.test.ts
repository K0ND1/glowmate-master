import { describe, it, expect, mock, beforeEach } from "bun:test";
import { createReview, getProductReviews } from "../controllers/review.controller";
import prisma from "../db/prisma";
import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";

// Mock dependencies
mock.module("../db/prisma", () => ({
  default: {
    product: {
      findUnique: mock(),
      update: mock(),
    },
    review: {
      findUnique: mock(),
      create: mock(),
      findMany: mock(),
      count: mock(),
      aggregate: mock(),
    },
    $transaction: mock((promises) => Promise.all(promises)),
  },
}));

describe("Review Controller", () => {
  let req: Partial<AuthRequest>;
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
    req = {};
  });

  describe("createReview", () => {
    it("should create a review successfully", async () => {
      req.user = { userId: "user-123", email: "test@example.com" };
      req.params = { barcode: "123456" };
      req.body = { rating: 5, comment: "Great!" };

      (prisma.product.findUnique as any).mockResolvedValue({ id: "prod-1" });
      (prisma.review.findUnique as any).mockResolvedValue(null);
      (prisma.review.create as any).mockResolvedValue({ id: "rev-1", rating: 5 });
      (prisma.review.aggregate as any).mockResolvedValue({ _avg: { rating: 5 } });
      (prisma.review.count as any).mockResolvedValue(1);
      (prisma.product.update as any).mockResolvedValue({});

      await createReview(req as AuthRequest, res as Response);

      expect(prisma.review.create).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(201);
    });

    it("should return 404 if product not found", async () => {
      req.user = { userId: "user-123", email: "test@example.com" };
      req.params = { barcode: "123456" };
      req.body = { rating: 5 };

      (prisma.product.findUnique as any).mockResolvedValue(null);

      await createReview(req as AuthRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });

    it("should return 409 if already reviewed", async () => {
        req.user = { userId: "user-123", email: "test@example.com" };
        req.params = { barcode: "123456" };
        req.body = { rating: 5 };
  
        (prisma.product.findUnique as any).mockResolvedValue({ id: "prod-1" });
        (prisma.review.findUnique as any).mockResolvedValue({ id: "existing-rev" });
  
        await createReview(req as AuthRequest, res as Response);
  
        expect(statusMock).toHaveBeenCalledWith(409);
      });
  });

  describe("getProductReviews", () => {
      it("should return reviews for a product", async () => {
        req.params = { barcode: "123456" };
        req.query = {};

        (prisma.product.findUnique as any).mockResolvedValue({ id: "prod-1" });
        (prisma.review.findMany as any).mockResolvedValue([{ id: "rev-1" }]);
        (prisma.review.count as any).mockResolvedValue(1);

        await getProductReviews(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(200);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            reviews: expect.any(Array),
            total: 1
        }));
      });
  });
});
