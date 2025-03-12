const bcrypt = require("bcryptjs");
const prisma = require("../../models/prisma/prismaClient");
const { generateTokens } = require("../../utils/tokenUtils");
const jwt = require("jsonwebtoken");
const { loginService } = require("./loginService");

jest.mock("../../models/prisma/prismaClient", () => ({
  user: { findUnique: jest.fn() },
  device: { findUnique: jest.fn(), create: jest.fn(), update: jest.fn() },
  refreshToken: { create: jest.fn() },
}));

jest.mock("bcryptjs", () => ({ compare: jest.fn() }));
jest.mock("../../utils/tokenUtils", () => ({ generateTokens: jest.fn() }));
jest.mock("jsonwebtoken", () => ({ sign: jest.fn() }));

describe("loginService", () => {
  const mockUser = {
    id: 1,
    email: "test@example.com",
    passwordHash: "hashedpassword",
    role: {
      name: "ADMIN",
      rolePermissions: [{ permission: { name: "READ_USERS" } }],
    },
  };

  const mockDevice = { id: 10, deviceId: "device123" };
  const mockTokens = { accessToken: "access-token", refreshToken: "refresh-token" };
  const mockSignedUserId = "signed-user-id";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should log in successfully with correct credentials", async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    generateTokens.mockReturnValue(mockTokens);
    prisma.device.findUnique.mockResolvedValue(null); // No existing device
    prisma.device.create.mockResolvedValue(mockDevice);
    prisma.refreshToken.create.mockResolvedValue({});
    jwt.sign.mockReturnValue(mockSignedUserId);

    const result = await loginService("test@example.com", "password123", "device123", "Mozilla/5.0", "127.0.0.1");

    expect(result).toEqual({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      device: mockDevice,
      roleName: "ADMIN",
      signedUserId: "signed-user-id",
      userId: 1,
    });

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: "test@example.com" },
      include: expect.any(Object),
    });

    expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedpassword");
    expect(generateTokens).toHaveBeenCalledWith(1, "ADMIN", ["READ_USERS"]);
    expect(prisma.device.create).toHaveBeenCalled();
    expect(prisma.refreshToken.create).toHaveBeenCalled();
    expect(jwt.sign).toHaveBeenCalledWith({ userId: 1 }, process.env.JWT_SECRET, { expiresIn: "30d" });
  });

  it("should throw an error when user is not found", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    await expect(loginService("test@example.com", "password123", "device123", "Mozilla/5.0", "127.0.0.1"))
      .rejects.toThrow("User not found");

    expect(prisma.user.findUnique).toHaveBeenCalled();
    expect(bcrypt.compare).not.toHaveBeenCalled();
  });

  it("should throw an error when password is incorrect", async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(false); // Wrong password

    await expect(loginService("test@example.com", "wrongpassword", "device123", "Mozilla/5.0", "127.0.0.1"))
      .rejects.toThrow("Invalid email or password");

    expect(bcrypt.compare).toHaveBeenCalledWith("wrongpassword", "hashedpassword");
  });

  it("should update device info if it already exists", async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    generateTokens.mockReturnValue(mockTokens);
    prisma.device.findUnique.mockResolvedValue(mockDevice); // Existing device
    prisma.device.update.mockResolvedValue(mockDevice);
    prisma.refreshToken.create.mockResolvedValue({});
    jwt.sign.mockReturnValue(mockSignedUserId);

    const result = await loginService("test@example.com", "password123", "device123", "Mozilla/5.0", "127.0.0.1");

    expect(prisma.device.update).toHaveBeenCalledWith({
      where: { deviceId: "device123" },
      data: { userAgent: "Mozilla/5.0", ipAddress: "127.0.0.1" },
    });

    expect(result.device).toEqual(mockDevice);
  });
});
