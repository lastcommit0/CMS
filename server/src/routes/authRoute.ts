import {Router} from "express";
import catchAsync from "../middleware/catchAsync";
import * as authController from "../controllers/authController";
import passport from 'passport';


const router = Router();

router.post("/register", catchAsync(authController.register));
router.post("/identify", catchAsync(authController.identify));
router.post("/login", catchAsync(authController.login));
router.post("/refresh", catchAsync(authController.refresh));
router.post("/logout", catchAsync(authController.logout));
router.post("/logoutAll", catchAsync(authController.logoutAll)); 

router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { session: false }),
  catchAsync(authController.login)
);

export default router;