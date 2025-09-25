import { Router } from 'express';
import * as AuthController from '../controllers/auth.controller.js';
import { validateBody } from "../middleware/validate.js";
import { rateLimit } from  "../middleware/rateLimit.js";

const signupBody = {
    email: {type: "email", required: true},
    username: {type: "string", required: true, min: 3, max: 30},
    password: {type: "string", required: true, min: 8, max: 100}
};

const loginBody = {
    email: {type: "email", required: true},
    password: {type: "string", required: true, min: 8, max: 100}
};

const router = Router();

router.post(
    "/signup",
    rateLimit({windowMs: 60 * 60 * 1000, max: 10}),
    validateBody(signupBody),
    AuthController.signup
)

router.post(
    "/login",
    rateLimit({windowMs: 15 * 60 * 1000, max: 20}),
    validateBody(loginBody),
    AuthController.login
)

router.post(
    "/logout", 
    rateLimit({windowMs: 15 * 60 * 1000, max: 100}),
    AuthController.logout
);

export default router;