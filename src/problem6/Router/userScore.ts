import { StatusCodes } from "http-status-codes";
import express from "express";

import {
  authenticateToken,
  authorizeRole,
} from "../../middlewares/authenticate";
import { ConfigRepository } from "../Config/repositories/config.repository";
import ConfigService from "../Config/services/config.service";

import { UserScoreRepository } from "../UserScore/repositories/userScore.repository";
import UserScoreController from "../UserScore/controllers/userScore.controller";
import UserScoreValidation from "../UserScore/validators/userScore.validation";
import UserScoreService from "../UserScore/services/userScore.service";

import { Validator } from "../../middlewares/validator";

const router = express.Router();
const configService = new ConfigService(ConfigRepository);

const userScoreService = new UserScoreService(UserScoreRepository);
const userScoreController = new UserScoreController(userScoreService);

// Hàm để lấy cấu hình từ database
const getAddScoreConfig = async (): Promise<boolean> => {
  const config = await configService.getConfigDetail();
  return config.isAddScoreEnabled;
};

// Middleware để kiểm tra xem add score API có được bật không
const checkAddScoreEnabled = async (req: any, res: any, next: any) => {
  const isAddScoreEnabled = await getAddScoreConfig(); // Lấy giá trị mới từ database
  if (!isAddScoreEnabled) {
    res.status(StatusCodes.FORBIDDEN).json({
      success: false,
      statusCode: StatusCodes.FORBIDDEN,
      message: "Forbidden!",
    });
    return;
  }
  next();
};

// Route để thêm điểm cho người dùng
router.put(
  "/user/:id/add-score",
  Validator(UserScoreValidation.addScore),
  authenticateToken,
  checkAddScoreEnabled,
  userScoreController.addScore
);

// Route để cập nhật tất cả điểm
router.put(
  "/user/update-all-scores",
  Validator(UserScoreValidation.updateAllScores),
  authenticateToken,
  authorizeRole(["admin"]),
  userScoreController.updateAllScores
);

export default router;