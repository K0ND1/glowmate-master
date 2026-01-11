import { describe, it, expect, mock, beforeEach, afterEach } from "bun:test";
import { register, login } from "../controllers/auth.controller";
import prisma from "../db/prisma";
import * as passwordUtils from "../utils/password";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

// Mock dependencies
mock.module("../db/prisma", () => {
  const userCreate = mock();
  const userFindUnique = mock();
  const tokenCreate = mock();

  const prismaClient = {
    user: {
      findUnique: userFindUnique,
      create: userCreate,
    },
    verificationToken: {
      create: tokenCreate,
    },
    $transaction: mock(async (callback) => callback(prismaClient)),
  };

  return { default: prismaClient };
});

mock.module("../utils/password", () => ({
  hashPassword: mock(),
  verifyPassword: mock(),
}));

mock.module("jsonwebtoken", () => ({
  default: {
    sign: mock(),
  },
}));

describe("Auth Controller", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let jsonMock: any;
  let statusMock: any;

  beforeEach(() => {
    jsonMock = mock(() => { });
    statusMock = mock(() => ({ json: jsonMock }));
    res = {
      status: statusMock,
      json: jsonMock,
    } as any;
    req = {};
  });

  describe("register", () => {
    it("should register a new user successfully", async () => {
      req.body = {
        email: "test@example.com",
        password: "password123",
        name: "Test User",
        age: 25,
        skinType: "normal",
      };

      (prisma.user.findUnique as any).mockResolvedValue(null);
      (passwordUtils.hashPassword as any).mockResolvedValue("hashedPassword");
      (prisma.user.create as any).mockResolvedValue({
        id: "user-123",
        email: "test@example.com",
        name: "Test User",
        age: 25,
        createdAt: new Date(),
        skinProfile: {
          skinType: "normal",
          skinConditions: [],
          allergens: []
        }
      });
      (jwt.sign as any).mockReturnValue("token123");

      await register(req as Request, res as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(passwordUtils.hashPassword).toHaveBeenCalled();
      expect(prisma.user.create).toHaveBeenCalled();
      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        token: "token123",
        user: expect.objectContaining({
          email: "test@example.com",
        }),
      }));
    });

    it("should return 400 if required fields are missing", async () => {
      req.body = {
        email: "test@example.com",
        // password missing
      };

      await register(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        code: "VALIDATION_ERROR",
      }));
    });

    it("should return 409 if user already exists", async () => {
      req.body = {
        email: "existing@example.com",
        password: "password123",
        name: "Existing User",
        age: 30,
        skinType: "oily",
      };

      (prisma.user.findUnique as any).mockResolvedValue({ id: "existing-id" });

      await register(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        code: "EMAIL_EXISTS",
      }));
    });
  });

  describe("login", () => {
    it("should login successfully with valid credentials", async () => {
      req.body = {
        email: "test@example.com",
        password: "password123",
      };

      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        password: "hashedPassword",
        name: "Test User",
        age: 25,
        createdAt: new Date(),
        skinProfile: {
          skinType: "normal"
        }
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (passwordUtils.verifyPassword as any).mockResolvedValue(true);
      (jwt.sign as any).mockReturnValue("token123");

      await login(req as Request, res as Response);

      expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: "test@example.com" } });
      expect(passwordUtils.verifyPassword).toHaveBeenCalledWith("password123", "hashedPassword");
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        token: "token123",
      }));
    });

    it("should return 401 for invalid password", async () => {
      req.body = {
        email: "test@example.com",
        password: "wrongpassword",
      };

      const mockUser = {
        id: "user-123",
        email: "test@example.com",
        password: "hashedPassword",
      };

      (prisma.user.findUnique as any).mockResolvedValue(mockUser);
      (passwordUtils.verifyPassword as any).mockResolvedValue(false);

      await login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith(expect.objectContaining({
        code: "INVALID_CREDENTIALS",
      }));
    });

    it("should return 401 if user not found", async () => {
      req.body = {
        email: "nonexistent@example.com",
        password: "password123",
      };

      (prisma.user.findUnique as any).mockResolvedValue(null);

      await login(req as Request, res as Response);

      expect(statusMock).toHaveBeenCalledWith(401);
    });
  });
});
