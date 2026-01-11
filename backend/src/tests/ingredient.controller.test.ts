import { describe, it, expect, mock, beforeEach } from "bun:test";
import { suggestIngredients } from "../controllers/ingredient.controller";
import prisma from "../db/prisma";
import type { Request, Response } from "express";

// Mock dependencies
mock.module("../db/prisma", () => ({
  default: {
    ingredient: {
      findMany: mock(),
    },
  },
}));

describe("Ingredient Controller", () => {
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

  describe("suggestIngredients", () => {
    it("should return ingredient suggestions", async () => {
      req.query = { q: "acid" };

      const mockIngredients = [
          { id: "i1", name: "Salicylic Acid" },
          { id: "i2", name: "Hyaluronic Acid" }
      ];

      (prisma.ingredient.findMany as any).mockResolvedValue(mockIngredients);

      await suggestIngredients(req as Request, res as Response);

      expect(prisma.ingredient.findMany).toHaveBeenCalledWith(expect.objectContaining({
          where: {
              name: { contains: "acid", mode: "insensitive" }
          }
      }));
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(mockIngredients);
    });

    it("should return 400 if query is missing", async () => {
        req.query = {};

        await suggestIngredients(req as Request, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
    });
  });
});
