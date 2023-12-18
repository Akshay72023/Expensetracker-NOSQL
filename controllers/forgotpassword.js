const bcrypt = require('bcrypt');
const User = require('../models/user');
const Forgotpassword = require('../models/forgotpassword');
const nodemailer = require('nodemailer');
require('dotenv').config();

exports.forgotpassword = async (req, res, next) => {
    try {
      const { email } = req.body;
      console.log(email);
      const user = await User.findOne({ email });
      console.log(user);
      console.log('forgot user>>>', user.email);
      if (user.email) {
        var obj = new Forgotpassword({active: true ,userId: user._id});
        obj.save();
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          auth: {
            user: process.env.EMAIL_USER, 
            pass: process.env.EMAIL_PASS, 
          },
        });
        const mailOptions = {
          from: process.env.EMAIL_USER, 
          to: email,
          subject: 'Reset Password',
          text: 'Click the link below to reset your password:',
          html: `<p>Click the link below to reset your password:</p><a href="http://localhost:5000/password/resetpassword/${obj._id}">Reset password</a>`
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
        res.status(200).json({ message: 'Email sent successfully.' });
      } else {
        res.status(404).json({ message: 'User not found.' });
      }
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: error.message, message: false });
    }
  };

  exports.resetpassword = (req, res) => {
    const id =  req.params.id;
    Forgotpassword.findById(id).then(forgotpasswordrequest => {
      if(forgotpasswordrequest){
          forgotpasswordrequest.active= false;
          forgotpasswordrequest.save();
            res.status(200).send(`<html>
                        <body>
                            <script>
                                document.getElementById("form").addEventListener('submit',
                                async function (e) {
                                    e.preventDefault();
                                    console.log('called')
                              });
                            </script>
                            <form action="http://localhost:5000/password/updatepassword/${id}" id="form" method="get">
                            <label for="password">Enter New Password</label><br>
                            <input type="password" name="password" id="password" required/><br><br>
                            <button type="submit" >Reset password</button><br><br>
                            </form>
                        </body>
                      </html>`)
            res.end()

        }
    })
}
  


exports.updatepassword = (req, res) => {
  try {
    const { password } = req.query;
    const resetpasswordid = req.params.id;
    Forgotpassword.findOne({ _id: resetpasswordid })
      .then((resetpasswordrequest) => {
        User.findById(resetpasswordrequest.userId)
          .then((user) => {
            console.log('userDetails', user);
            if (user) {
              // Encrypt the new password
              const saltRounds = 10;
              bcrypt.hash(password, saltRounds, function (err, hash) {
                user.password = hash;
                user.save()
                  .then(() => {
                    res.status(201).json('Successfully update the new password');
                  })
                  .catch((saveError) => {
                    console.error(saveError);
                    throw new Error(saveError);
                  });
              });
            } else {
              return res.status(404).json({ error: 'No user exists', success: false });
            }
          })
          .catch((userError) => {
            console.error(userError);
            throw new Error(userError);
          });
      })
      .catch((resetError) => {
        console.error(resetError);
        throw new Error(resetError);
      });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error', success: false });
  }
};
