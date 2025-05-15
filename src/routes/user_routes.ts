import {Router} from 'express';
import {registerUser, loginUser, verifyUser, logoutUser, forgetPassword, resetForgottenPassword, changePassword, getUserDetails} from '../controllers/user_controller.ts';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyUser);
router.post('/forget-password', forgetPassword);
router.post('/reset-forgotten-password', resetForgottenPassword);
router.post('/change-password', changePassword);
router.post('/logout', logoutUser);
router.get('/user-details', getUserDetails);

export default router;

