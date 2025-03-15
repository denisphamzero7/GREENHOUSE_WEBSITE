const router =  require('express').Router();
const controller = require('../controllers/usersController')
const uploadCloud= require('../config/cloudinary.config')
const {verifyAccessToken,isAdminOrManager,isStaff } = require('../middlewares/verifytoken')
const validate = require('../middlewares/validate')
const{loginSchema ,registerSchema} = require('../validators/userValidator')

router.post('/register',validate(registerSchema),controller.register)
router.post('/login',validate(loginSchema),controller.login)
router.post('/refreshtoken',controller.refreshToken)
router.post('/resendotp',controller.resendOTP)
router.post('/verifyotp',controller.verifyOTP)
router.post('/logout', verifyAccessToken, controller.logout); 
router.get('/profile',verifyAccessToken,controller.currentUser)
router.put('/:uid',[verifyAccessToken,isAdminOrManager],uploadCloud.single('image'),controller.updateUser)
router.get('/',[verifyAccessToken,isAdminOrManager],controller.getUsers)
router.get('/:uid',[verifyAccessToken,isAdminOrManager,isStaff],controller.getUser)
module.exports = router;
//register,login,getUsers,getUser,updateUser,verifyOTP,resendOTP