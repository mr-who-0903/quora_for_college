const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const {User, Question, File} =  require('../model/userSchema');  // "User" is our collection, mernstack is our database
const authenticate = require('../middleware/authenticate');

// USING ASYNC AWAIT 
// FOR SIGN UP PAGE
router.post('/register', async (req,res) => {
   
    const { username, email, password, cpassword } = req.body;   // retrive all data from user

    if(!username || !email || !password || !cpassword){                  // check if all details are filled or not
        return res.status(422).json({ error: "Please fill all the details !" });
    }

    try{
        const userExist = await User.findOne({email:email});            // check if email already exists or not

        if(userExist){
            return res.status(422).json({ error: "Email already exists !" });
        }
        else{
            if(password !== cpassword){
                return res.status(422).json({ error: "Passwords are not matching !" });
            }
            else{
                const user = new User({ username, email, password, cpassword });   // store the document in collection
                //****  NOW PASSWORD HASHING IN userSchema.js file BEFORE user.save() ****/
                await user.save();
                res.status(201).json({ message: "User registered successfully !" });
            }
        }
    }
    catch(err){
        console.log(err);
    }
})

// FOR SIGN IN PAGE
router.post('/login', async (req, res) =>{

    const { email, password } = req.body;
  
    if(!email || !password){
        return res.status(422).json({ error: "Please fill all the details !" });
    }

    try{

        const findUser = await User.findOne({email:email});  // check if user already regestered
        
        if(!findUser){
            return res.status(400).json({ error: "Invalid credentials !" });  // when user is not found in db
        }
        else{
            const isPasswordMatch = await bcrypt.compare(password, findUser.password);  // check if entered password is correct
            if(!isPasswordMatch){
                return res.status(400).json({ error: "Invalid credentials !" });   // if wrong password is entered 
            }
            else{  
                let token = await findUser.generateAuthToken(); // generate token in userSchema.js file, save it to db.
                console.log(token);

                res.cookie('jwtoken', token, {
                    expires: new Date(Date.now() + 25892000000),   // cookie will expire after 25892000000 milisec = 30days after login
                    httpOnly:true                                  // then user have to again log in  
                });
                return res.status(200).json({ message: "Signed in successfully !" });
            }
        }
    }
    catch(err) {
        console.log(err);
    }
})

// GET USER DATA FROM BACKEND TO QUORA PAGE
router.get('/getdata', authenticate, (req, res) =>{     // here authenticate is a middleware which verifies token   
                                                        // inside cookies with the token in the db else it will 
    res.send(req.rootUser);                             // redirect user to signin page.
})

router.get('/getquestions', async(req, res) => {

    try{
        const questions = await Question.find().sort({date: -1});
        res.send(questions);
    }
    catch(e){ console.log("get question error"); }
    
})

//POST QUESTION
router.post('/question', authenticate, async (req, res)=>{

    const { question } = req.body;   // retrive all data from user
    
    if(!question){                  // check if all details are filled or not
        return res.status(422).json({ error: "Please fill all the details !" });
    }

    try{
          
        const ques = new Question({ question: question, username: req.rootUser.username, email: req.rootUser.email });   // store the document in collection
        await ques.save();
        res.status(201).json({ message: "Question posted successfully !" });
    }
    catch(e){ console.log({question_post_err:e}) }

})

// POST ANSWER TO A QUESTION BACKEND
router.post('/answer/:id', authenticate, async (req, res) =>{  
    
    const { answer, date } = req.body;

        if(!answer || !date){
            console.log("message form please fill all the details");
            res.status(401).json({msg_error: "please fill the all details"});
        }
    
    try{

        const findQuestion = await Question.findOne({_id: req.params.id});   // ques ID
        if(findQuestion){
            const ans = await findQuestion.addAnswer(req.rootUser.username, req.rootUser.email, answer, date);
            return res.status(201).json({ message:"answer submitted !" });
        }
    }
    catch(err){
        console.log(err);
    }  
})

// DELETE POST
router.get('/delete/:id', async(req, res) =>{

  try{

      await Question.remove({_id: req.params.id});
      res.status(201).json({ message: "Post deleted." });
      
  }
  catch(err){
    console.log(err);
  }
})

// FOR LOGOUT
router.get('/logout', (req, res) =>{
    console.log('logout page');
    res.clearCookie('jwtoken', { path:'/' });
    res.status(200).send('user logout');
})

/* UPLOAD AND DOWNLOAD FILES */

const upload = multer({
    storage: multer.diskStorage({
      destination(req, file, cb) {
        cb(null, './files');
      },
      filename(req, file, cb) {
        cb(null, `${new Date().getTime()}_${file.originalname}`);
      }
    }),
    limits: {
      fileSize: 1000000 // max file size 1MB = 1000000 bytes
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpeg|jpg|png|pdf|doc|docx|xlsx|xls)$/)) {
        return cb(
          new Error(
            'only upload files with jpg, jpeg, png, pdf, doc, docx, xslx, xls format.'
          )
        );
      }
      cb(undefined, true); // continue with upload
    }
  });

  router.post('/upload',
    upload.single('file'),
    async (req, res) => {
      try {
        const { title, description } = req.body;
        const { path, mimetype } = req.file;
        const file = new File({
          title,
          description,
          file_path: path,
          file_mimetype: mimetype
        });
        await file.save();
        res.send('file uploaded successfully.');
      } catch (error) {
        res.status(400).send('Error while uploading file. Try again later.');
      }
    },
    (error, req, res, next) => {
      if (error) {
        res.status(500).send(error.message);
      }
    }
  );

  router.get('/getAllFiles', async (req, res) => {
    try {
      const files = await File.find({});
      const sortedByCreationDate = files.sort(
        (a, b) => b.createdAt - a.createdAt
      );
      res.send(sortedByCreationDate);
    } catch (error) {
      res.status(400).send('Error while getting list of files. Try again later.');
    }
  });
  
  router.get('/download/:id', async (req, res) => {
    try {
      const file = await File.findById(req.params.id);
      res.set({
        'Content-Type': file.file_mimetype
      });
      res.sendFile(path.join(__dirname, '..', file.file_path));
    } catch (error) {
      res.status(400).send('Error while downloading file. Try again later.');
    }
  });

module.exports = router;