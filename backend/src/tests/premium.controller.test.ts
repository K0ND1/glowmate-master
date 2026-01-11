import { describe, it, expect, mock, beforeEach } from "bun:test";
import { subscribe } from "../controllers/premium.controller";
import prisma from "../db/prisma";
import type { Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";

// Mock dependencies
mock.module("../db/prisma", () => ({
  default: {
    user: {
      update: mock(),
    },
  },
}));

describe("Premium Controller", () => {
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

  describe("subscribe", () => {
    it("should subscribe to monthly plan", async () => {
      req.user = { userId: "user-123", email: "test@example.com" };
      req.body = { tier: "monthly" };

      (prisma.user.update as any).mockResolvedValue({});

      await subscribe(req as AuthRequest, res as Response);

      expect(prisma.user.update).toHaveBeenCalledWith(expect.objectContaining({
          where: { id: "user-123" },
          data: expect.objectContaining({
              isPremium: true
          })
      }));
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it("should return 400 for invalid tier", async () => {
        req.user = { userId: "user-123", email: "test@example.com" };
        req.body = { tier: "invalid" };

        await subscribe(req as AuthRequest, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
    });
  });
});
