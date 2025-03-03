import { UnauthorizedError } from "../utilities/error";
import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";

export const authenticateToken = (req: any, res: any, next: any) => {
  const token =
    req.headers["authorization"] && req.headers["authorization"].split(" ")[1];
  if (!token) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      statusCode: StatusCodes.UNAUTHORIZED,
      message: "Unauthorize!",
    });
    return;
  }
  jwt.verify(token, "KaienG", (err: any, user: any) => {
    if (err) throw new UnauthorizedError("Unauthorize!");
    req.user = user;
    next();
  });
};

// Middleware để kiểm tra vai trò
export const authorizeRole = (roles: string[]) => {
  return (req: any, res: any, next: any) => {
    if (!roles.includes(req.user.role)) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: "Forbidden!",
      });
      return;
    }
    next();
  };
};

export const toggleApi = (flag: boolean) => {
  return (req: any, res: any, next: any) => {
    if (!flag) {
      res.status(StatusCodes.FORBIDDEN).json({
        success: false,
        statusCode: StatusCodes.FORBIDDEN,
        message: "Forbidden!",
      });
      return;
    }
    next();
  };
};
