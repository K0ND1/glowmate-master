import { describe, it, expect, mock, beforeEach } from "bun:test";
import { getMe, updateMe } from "../controllers/user.controller";
import prisma from "../db/prisma";
import type { Request, Response } from "express";
import type { AuthRequest } from "../middleware/auth.middleware";

// Mock dependencies
mock.module("../db/prisma", () => ({
  default: {
    user: {
      findUnique: mock(),
      update: mock(),
    },
  },
}));

describe("User Controller", () => {
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
    req = {
        user: { userId: "user-123", email: "test@example.com" }
    };
  });

  describe("getMe", () => {
    it("should return user profile", async () => {
      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        age: 25,
        isPremium: false,
        createdAt: new Date(),
        skinProfile: {
            skinType: "normal",
            skinConditions: [],
            allergens: []
        }
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);

      await getMe(req as AuthRequest, res as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { id: "user-123" } });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        id: "user-123",
        email: "test@example.com",
      }));
    });

    it("should return 404 if user not found", async () => {
      (prisma.user.findUnique as any).mockResolvedValue(null);

      await getMe(req as AuthRequest, res as Response);

      expect(statusMock).toHaveBeenCalledWith(404);
    });
  });

  describe("updateMe", () => {
    it("should update user profile", async () => {
      req.body = {
        name: "Updated Name",
        age: 26,
      };

      (prisma.user.update as any).mockResolvedValue({});

      await updateMe(req as AuthRequest, res as Response);

      expect(prisma.user.update).toHaveBeenCalledWith({
        where: { id: "user-123" },
        data: expect.objectContaining({
            name: "Updated Name",
            age: 26
        })
      });
      expect(statusMock).toHaveBeenCalledWith(200);
    });

    it("should validate input", async () => {
        req.body = {
            age: 5 // Invalid age
        };

        await updateMe(req as AuthRequest, res as Response);

        expect(statusMock).toHaveBeenCalledWith(400);
        expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
            code: "VALIDATION_ERROR"
        }));
    });
  });
});
