const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path=require('path');

dotenv.config();
const app = express();

app.use(bodyParser.json());
app.use(cors());

const signupRoutes = require('./routes/user');
const passwordRoutes = require('./routes/forgotpassword');
const purchaseRoutes = require('./routes/purchase');
const expenseRoutes = require('./routes/expense');
const premiumRoutes = require('./routes/premiumfeature');


app.use('/user', signupRoutes);
app.use('/password',passwordRoutes);
app.use('/purchase', purchaseRoutes);
app.use('/expense',expenseRoutes);
app.use('/premium',premiumRoutes);



app.use((req,res,next)=>{
    res.sendFile(path.join(__dirname,`Views/${req.url}`))
})


mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dapnb0i.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`)
.then( result =>{
  app.listen(5000);
  console.log('connected');
})
.catch(err => {
  console.log(err);
})
