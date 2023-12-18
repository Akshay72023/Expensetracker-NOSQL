const express= require('express');
const router= express.Router();
const passwordController= require('../controllers/forgotpassword');


router.post('/forgotpassword',passwordController.forgotpassword);

router.get('/resetpassword/:id',passwordController.resetpassword);

router.get('/updatepassword/:id',passwordController.updatepassword);


module.exports= router;