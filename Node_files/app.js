// Library import section

const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const { Validator } = require('node-input-validator');
const md5 = require('md5');
const session = require('express-session');
const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');
const Validators = require("validator");
const isEmpty = require("is-empty");
const dateFormat = require('dateformat');
const commonfunctions = require('./commonfunctions.js');
const multer = require('multer');

// multer config
var storage = multer.diskStorage({

    destination: function (req, file, cb) {
    	if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
	        return cb(new Error('Only image files are allowed!'), false);
	    }
      	cb(null, '/home/developer/Workarea/Sasi/React_module/modules/public/uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + '-' +file.originalname )
    }
})
var upload = multer({ storage: storage }).single('file')

// app use Section
app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

// Responce Section

app.post('/register' ,function(req,res) {

	const v = new Validator(req.body, {
	    email: 'required',
	    name : 'required|alpha|maxLength:50',
	    phone: 'required|integer|maxLength:16'
	});

	v.check().then((matched) => {

	    if (!matched) {
	      res.status(422).json(v.errors);
	    }
	    else{
	    	var errors ={};
	    	var myobj = { 
	    		name: req.body.name, 
	    		email: req.body.email,
	    		phone:req.body.phone,
	    		password:req.body.password,
	    		status:"A",
	    		user_type:"U",
	    		books:[]
	    	};

	    	commonfunctions.userLogin(req.body.email).then(function(result){
	    		if(result==null) {
	    			commonfunctions.registerUser(myobj).then(function(result){
	    				return res.status(200).json({"Success":true});
	    			})
	    		} else {
	    			errors.email="The Email is Already Exits";
	    			return res.status(404).json(errors);
	    		}
	    	});
	    }
	});
});


app.post('/login',function(req,res) {

	var errors = {};
	var isValid = true;

	req.body.email = !isEmpty(req.body.email) ? req.body.email : "";
  	req.body.password = !isEmpty(req.body.password) ? req.body.password : "";

	if (Validators.isEmpty(req.body.email)) {
	    errors.email = "Email field is required";
	    isValid=false;
	} else if (!Validators.isEmail(req.body.email)) {
	    errors.email = "Email is invalid";
	    isValid=false;
	}
	if (Validators.isEmpty(req.body.password)) {
	    errors.password = "Password field is required";
	    isValid=false;
	}

	if(!isValid) {
		return res.status(422).json(errors);
	} else {
		commonfunctions.userLogin(req.body.email).then(function(result){
			if(result==null) {
				return res.status(422).json({'email':"The User is Not Registered"});
			} else {
				if(result.password === req.body.password) {
					var responce_date = {
						_id:result._id,
						name:result.name,
						user_status:result.status,
						user_type:result.user_type,
						email:result.email
					}
					return res.status(200).json({data:responce_date});
				} else {
					return res.status(422).json({password:"Incorrect Password"});
				}
			}
		});
	}
});

app.get('/get_all_books',function(req,res) {
	commonfunctions.get_books().then(function(result) {
	    return res.status(200).json({data:result})
	});
});

app.post('/add_books',function(req,res) {

	var errors = {};
	var isValid = true;

	var availablity_date = '';
	if(req.body.availability_status ==2) {
		availablity_date = req.body.availablity_date
	}

	req.body.book_name = !isEmpty(req.body.book_name) ? req.body.book_name : "";
  	req.body.auther_name = !isEmpty(req.body.auther_name) ? req.body.auther_name : "";
  	req.body.price = !isEmpty(req.body.price) ? req.body.price : "";
  	req.body.availability_status = !isEmpty(req.body.availability_status) ? req.body.availability_status : "";
  	req.body.availablity_date = !isEmpty(req.body.availablity_date) ? req.body.availablity_date : "";
  	req.body.description = !isEmpty(req.body.description) ? req.body.description : "";

	if (Validators.isEmpty(req.body.book_name)) {
	    errors.book_name = "Book Name is required";
	    isValid=false;
	} 
	if (Validators.isEmpty(req.body.auther_name)) {
	    errors.auther_name = "Auther Name is required";
	    isValid=false;
	}
	if (Validators.isEmpty(req.body.price)) {
	    errors.price = "Book Price is required";
	    isValid=false;
	} 
	if (Validators.isEmpty(req.body.availability_status)) {
	    errors.availability_status = "Availablity Status is required";
	    isValid=false;
	}
	if (Validators.isEmpty(req.body.description)) {
	    errors.description = "Description is required";
	    isValid=false;
	}
	if(!isValid) {
		return res.status(422).json(errors);
	} else {
		var myobj = {
		    "book_name" : req.body.book_name,
		    "image" : "",
		    "description" : req.body.description,
		    "price" : req.body.price,
		    "book_type" : "Novel",
		    "taken_by" : "",
		    "availability_status" : req.body.availability_status,
		    "available_date" : availablity_date,
		    "auther_name" : req.body.auther_name,
		};

		commonfunctions.getTotalBookCount(req.body.book_name).then(function(result){
			var count = 0;
			if(result.length==0) {
				count=0;
			} else {
				count = result.length;
			}
			if(count<=0) {
				data ={
					book_name:req.body.book_name,
					book_count:1,
					available_count:1
				};
				commonfunctions.addBook(myobj).then(function(result){
					commonfunctions.getBookDetails(req.body.book_name).then(function(result){
						if(result==null) {
							commonfunctions.insertBookDetails(data).then(function(result){
								res.status(200).json({Success:true});
							})
						} else {
							commonfunctions.incrementBookCount(req.body.book_name,req.body.availability_status).then(function(result){
								res.status(200).json({Success:true});
							})
						}
					})
				})
			} else {
				count = count+1;
				var myquery = { book_name: req.body.book_name };
				var newvalues = { $set: { book_count: count } };
				if(parseInt(myobj.availability_status)!=2){
					commonfunctions.getBookDetails(myobj.book_name).then(function(result){
						if(req.body.availability_status) {
							newvalues = { $set : { book_count: count,available_count :result.available_count+1 }};
						} else {
							newvalues = { $set : { book_count: count}};
						}
						commonfunctions.updateBookDetails(myquery,newvalues).then(function(result){
							commonfunctions.addBook(myobj).then(function(){
								res.status(200).json({Success:true});
							})
						})
					})
				} else {		
					commonfunctions.updateBookDetails(myquery,newvalues).then(function(result){
						commonfunctions.addBook(myobj).then(function(){
							res.status(200).json({Success:true});
						})
					})
				}
			}
		})
	}
});

app.post('/delete',function(req,res){
	id = req.body.id;
	book_name = req.body.book_name;
	var myquery = { _id: new mongodb.ObjectID(id) };
	commonfunctions.getBook(myquery).then(function(results){
		commonfunctions.deleteBook(myquery).then(function(){
			commonfunctions.decrementBookCount(book_name,results.availability_status).then(function(result){
				commonfunctions.get_books().then(function(result) {
				    return res.status(200).json({data:result})
				});
			})
		});
	})
});

app.post('/get_book',function(req,res){
	id=req.body.id;
	var myquery = { _id:new mongodb.ObjectID(id) };
	commonfunctions.getBook(myquery).then(function(result){
		return res.status(200).json({data:result})
	});
});

app.post('/update_book',function(req,res){
	id = req.body.id;
	var errors = {};
	var isValid = true;
	var availablity_date = '';

	if(req.body.availability_status==2) {
		availablity_date = req.body.availablity_date
	}

	req.body.book_name = !isEmpty(req.body.book_name) ? req.body.book_name : "";
  	req.body.auther_name = !isEmpty(req.body.auther_name) ? req.body.auther_name : "";
  	req.body.price = !isEmpty(req.body.price) ? req.body.price : "";
  	req.body.availability_status = !isEmpty(req.body.availability_status) ? req.body.availability_status : "";
  	req.body.availablity_date = !isEmpty(req.body.availablity_date) ? req.body.availablity_date : "";
  	req.body.description = !isEmpty(req.body.description) ? req.body.description : "";

	if (Validators.isEmpty(req.body.book_name)) {
	    errors.book_name = "Book Name field is required";
	    isValid=false;
	} 
	if (Validators.isEmpty(req.body.auther_name)) {
	    errors.auther_name = "Auther Name field is required";
	    isValid=false;
	}
	if (Validators.isEmpty(req.body.price)) {
	    errors.price = "Book Price field is required";
	    isValid=false;
	} 
	if (Validators.isEmpty(req.body.availability_status)) {
	    errors.availability_status = "Availablity Status field is required";
	    isValid=false;
	}
	if (Validators.isEmpty(req.body.description)) {
	    errors.description = "Description field is required";
	    isValid=false;
	}
	if(!isValid) {
		return res.status(422).json(errors);
	} else {
		var myquery = { _id: new mongodb.ObjectID(id) };
		if(req.body.availability_status) {
			var newvalues = { $set: { 
					'book_name': req.body.book_name,
					"description" : req.body.description,
					"availability_status" : req.body.availability_status,
					"available_date" : availablity_date,
					"auther_name" : req.body.auther_name,
					"price" : req.body.price,
					"taken_by" : ''
				} 
			};
		} else {
			var newvalues = { $set: { 
					'book_name': req.body.book_name,
					"description" : req.body.description,
					"availability_status" : req.body.availability_status,
					"available_date" : availablity_date,
					"auther_name" : req.body.auther_name,
					"price" : req.body.price,
				} 
			};
		}
		commonfunctions.getBook(myquery).then(function(results){
			if(results.book_name==req.body.book_name) {
				commonfunctions.updateBook(myquery,newvalues).then(function(result){
					return res.status(200).json({Success : true});
				});
			} else {
				var count = 0;
				commonfunctions.updateBook(myquery,newvalues).then(function(result){
					commonfunctions.getBookDetails(req.body.book_name).then(function(result){
						if(result==null) {
							count = 0; 
						} else {
							count = result.length;
						}
						if(count<=0) {
							data ={
								book_name:req.body.book_name,
								book_count:1,
								available_count:1
							};
							commonfunctions.decrementBookCount(results.book_name,results.availability_status).then(function(result){
								commonfunctions.insertBookDetails(data).then(function(result){
									return res.status(200).json({Success : true});
								});
							});
						} else {
							commonfunctions.decrementBookCount(results.book_name,results.availability_status).then(function(result){
								commonfunctions.incrementBookCount(req.body.book_name,req.body.availability_status).then(function(result){
									return res.status(200).json({Success:true})
								});
							});
						}
					});
				});
			}
		})
	}
});

app.post('/take',function(req,res){
	id=req.body.id;
	taken_by=req.body.taken_by;
	date=req.body.date;
	book_name=req.body.book_name;
	var myquery = { _id : new mongodb.ObjectID(id) };	
	var newvalues = { $set: {
			"availability_status" : '2',
			"available_date" : date,
			"taken_by":taken_by
		}
	};
	commonfunctions.updateTakeStatus(myquery,newvalues).then(function(){
		commonfunctions.decrementBookCount(book_name,'3').then(function(){
			return res.status(200).json({Success : true});
		});
	});
});


app.post('/upload',function(req,res){

	upload(req, res, function (err) {
           if (err instanceof multer.MulterError) {
               return res.json({status:0,error:"Invalid File Type only ( jpg,jpeg,png,gif ) Formats are supported"})
           } else if (err) {
               return res.json({status:0,error:"Invalid File Type only ( jpg,jpeg,png,gif ) Formats are supported"})
           }
      return res.json({status:1});
    });
})

// Listening Section...
app.listen(3014, () => {
  console.log('The server is listening.....');
});