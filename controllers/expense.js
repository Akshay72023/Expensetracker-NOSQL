const Expense= require('../models/expense');
const User= require('../models/user');
const Downloads = require('../models/download');
const AWS = require('aws-sdk');
const UserServices = require('../Services/userservices');
const S3Services = require('../Services/S3services');


exports.postExpense= async(req,res,next)=>{
        try {
            const amount = req.body.amount;
            const description = req.body.description;
            const category = req.body.category;
            const expense = new Expense(
              {amount: amount, description: description, category: category, userId: req.user._id}
              );
            const data = await expense.save();
            const user = await User.findById( req.user._id );
             if(user){
                totalExpenses = +user.totalExpenses + +amount;
                await user.updateOne({ totalExpenses: totalExpenses});
              } 
            res.status(201).json({ newUserExpense: data });
      }
      catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Internal Server Error' });
        }

 };

 exports.getExpense = async (req, res, next) => {
  try {
      const ITEMS_PER_PAGE = +(req.query.itemPerPage || 1);
      const page = req.query.page || 1;
      const totalItems = await Expense.countDocuments({ userId: req.user._id });
      const expenseDetails = await Expense.find({ userId: req.user._id })
          .skip((page - 1) * ITEMS_PER_PAGE)
          .limit(ITEMS_PER_PAGE);
      return res.status(200).json({
          allExpense: expenseDetails,
          ispremiumuser: req.user.ispremiumuser,
          currentPage: page,
          hasNextPage: ITEMS_PER_PAGE * page < totalItems,
          nextPage: +page + 1,
          hasPreviousPage: page > 1,
          previousPage: +page - 1,
          lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
      });
  } catch (err) {
      console.error('Error in getExpense:', err);
      res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
};

 
exports.deleteExpense= async(req,res,next)=>{
  try{ 
    const expenseId = req.params.id;
    const expense = await Expense.findById(expenseId);
    if(req.user._id.toString() === expense.userId.toString()){
      const result = await Expense.findByIdAndDelete(expenseId);
        User.findById(req.user._id )
        .then(async (user) => {
            if(user){
               const totalExpenses = +user.totalExpenses - +expense.amount;
               await user.updateOne({ totalExpenses: totalExpenses});
               res.status(200).json(result)
            }
        })
       .catch((err) =>{
            return res.status(501).json({message: err, success: false});
        })    
    }
} catch (err) {
    return res.status(500).json({err: 'Something went wrong', success: false});
}
};

exports.downloadReport= async (req,res,next)=>{
  try {
    const expenses = await Expense.find({userId: req.user._id}); // here expenses are array. 
    const stringifiedExpenses = JSON.stringify(expenses); // converting array to string 
    // filename should depend upon userid
    const userid = req.user._id;
    const filename = `Expense${userid}/${new Date()}.txt`;
    const fileUrl = await S3Services.uploadToS3(stringifiedExpenses, filename);
    const download = new Downloads({fileUrl, userId: req.user._id });
    const urladdedtotable = await download.save();
    res.status(201).json({ fileUrl, success: true});
  } catch(err) {
    console.log(err);
    res.status(500).json({ fileUrl:'', success: false, err: err});  
  }  
};

exports.downloadHistory= async (req,res)=>{
  try{
    const download= await Downloads.find({userId: req.user._id});
    res.status(200).json({success:true, allFileUrl:download})
}catch(err){
  console.log(err)
  return res.status(500).json({fileUrl:'', success:false, message:'Failed', err:err})
  }
  
};