import { Router } from "express";
import catchAsync from "../middleware/catchAsync";
import * as authController from "../controllers/authController";
import passport from 'passport';
import { authLimiter } from "../middleware/rateLimiter";


const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

const router = Router();

router.post("/register", authLimiter, catchAsync(authController.register));
router.post("/identify", catchAsync(authController.identify));
router.post("/login", authLimiter, catchAsync(authController.login));
router.post("/refresh", catchAsync(authController.refresh));
router.post("/logout", catchAsync(authController.logout));
router.post("/logoutAll", authLimiter, catchAsync(authController.logoutAll));
router.get("/captcha", catchAsync(authController.getCaptcha));


router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    session: false,
    failureRedirect: `${CLIENT_URL}/auth?error=oauth_failed`,
  }),
  catchAsync(authController.googleCallback)
);


export default router;