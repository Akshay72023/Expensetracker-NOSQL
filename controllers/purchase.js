const Razorpay = require('razorpay');
const Order = require('../models/order');
const User= require('../models/user');
const jwt=require('jsonwebtoken');
require("dotenv").config();

const purchasepremium=async(req,res,next)=>{
    try{
        var rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
        rzp.orders.create({amount}, async (err,order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
        const odr = new Order({ orderid: order.id, status: 'PENDING',userId : req.user._id});
        await odr.save();
            try{
                return res.status(201).json({order, key_id: rzp.key_id});
            }   
            catch(err){
                throw new Error(err);
            }
        })
    } catch(err){
        console.log(err);
        res.status(403).json({ message: 'Something went wrong', error : err });
    }
}

function generateAccessToken(id,username,ispremiumuser){
    return jwt.sign({userId :id , username:username,ispremiumuser},process.env.TOKEN_SECRET);
}

const updatetransactionstatus = async (req, res) => {
    try {
        const { order_id, payment_id } = req.body;
        const order = await Order.findOne({ orderid: order_id });
        order.paymentid = payment_id;
        order.status = 'SUCCESSFUL';
        await order.save();

        const user = await User.findById(req.user._id);
        user.ispremiumuser = true;
        await user.save();
        try {
            const token = generateAccessToken(user._id, user.username, true);
            return res.status(202).json({ status: true, message: "Transaction Successful", token });
        } catch (err) {
            console.error(err);
            throw new Error(err);
        }

    } catch (err) {
        console.error(err);
        res.status(403).json({ message: 'Something went wrong', error: err });
    }
};


const updatetransactionstatusfail = async (req,res) => {
    try {
        const {order_id} = req.body;
        const order =await  Order.findOne({orderid: order_id});
        order.paymentid = payment_id;
        order.status = 'UNSUCCESSFUL';
        await order.save();
        const user =await User.findById(req.user._id);
        user.ispremiumuser = false;
        await user.save(); 
        try{
            return res.status(202).json({status : true, message : " Tranction Fail"});
           }
            catch(err) {
                    throw new Error(err);
                   };
    } catch(err)  {
        console.log(err);
        res.status(403).json({message : 'Something went wrong', error : err});
    } 
};

module.exports = {
    purchasepremium,
    updatetransactionstatus,
    updatetransactionstatusfail
};


