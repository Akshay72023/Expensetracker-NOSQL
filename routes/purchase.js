const express= require('express');
const router= express.Router();
const purchaseController= require('../controllers/purchase');
const authentication = require('../middleware/authentication');

router.post('/premiummembership',authentication.authenticate,purchaseController.purchasepremium);
router.post('/updatetransactionstatus',authentication.authenticate,purchaseController.updatetransactionstatus);
router.post('/updatetransactionstatusFail',authentication.authenticate,purchaseController.updatetransactionstatusfail);

module.exports= router;