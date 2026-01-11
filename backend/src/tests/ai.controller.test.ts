import { describe, it, expect, mock, beforeEach } from "bun:test";
import { analyzeRoutine } from "../controllers/ai.controller";
import prisma from "../db/prisma";
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";

// Mock dependencies
mock.module("../db/prisma", () => ({
  default: {
    product: {
      findMany: mock(),
    },
    aiAnalysis: {
      create: mock(),
    },
  },
}));

describe("AI Controller", () => {
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

  describe("analyzeRoutine", () => {
    it("should analyze routine successfully", async () => {
      req.user = { userId: "user-123", email: "test@example.com" };
      req.body = { productBarcodes: ["123", "456"] };

      (prisma.product.findMany as any).mockResolvedValue([
          { id: "p1", barcode: "123" },
          { id: "p2", barcode: "456" }
      ]);
      (prisma.aiAnalysis.create as any).mockResolvedValue({});

      await analyzeRoutine(req as AuthRequest, res as Response);

      expect(prisma.product.findMany).toHaveBeenCalled();
      expect(prisma.aiAnalysis.create).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
          overallScore: expect.any(Number)
      }));
    });

    it("should return 400 if productBarcodes is not an array", async () => {
        req.user = { userId: "user-123", email: "test@example.com" };
        req.body = { productBarcodes: "invalid" };

        await analyzeRoutine(req as AuthRequest, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
    });
  });
});
