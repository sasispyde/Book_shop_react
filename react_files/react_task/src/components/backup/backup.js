import React from 'react';

function Listing(props) {
  	var numbers = props.data;
  	const peopleArray = Object.keys(numbers).map(i => numbers[i]);
  	var listItems = peopleArray.map((number) =>
	    <tr key={number._id}>
            <td>{number.book_name}</td>
            <td>{number.auther_name}</td>
            <td>{number.price}</td>
            <td>{number.description}</td>
            { number.availability_status == 1 ? <td style={{color:"green"}}>Available</td> : <td style={{color:"red"}}>Out of stock</td>  }
            <td>{number.availability_status != 1 ? number.available_date.slice(0, 10)+" "+' Onwards' : "-"}</td>
            { 
            	number.availability_status == 1 ? 
            	<td>
            		<button title='Take Book' onClick={()=>props.onOpenModal(number._id)} className="waves-effect waves-white btn-small" style={{background : "white"}}>
            			<i className="material-icons" style={{color:"black"}}>book</i>
            		</button> 
            	{ 
            		props.Admin && 
            		<span>
            			<button title='Delete' className="waves-effect waves-white btn-small" onClick={() => props.onOpenDeleteModal(number._id)} style={{background : "white"}}><i style={{color:"black"}} className="material-icons">delete</i></button>
            			<button title='Edit' className="waves-effect waves-white btn-small" style={{background : "white"}} onClick={() => props.handleEdit(number._id)} ><i style={{color:"black"}} className="material-icons">edit</i></button>
            		</span> 
            	} 
            	</td>
            	:
            	<td>
            		<button title="Not Available" className="waves-effect waves-white btn-small" style={{background : "white"}}>
            			<i style={{color:"black"}} className="material-icons">block</i>
            		</button>
        			{ 
	            		props.Admin && 
	            		<span>
	            			<button title='Delete' className="waves-effect waves-white btn-small" onClick={() => props.onOpenDeleteModal(number._id)} style={{background : "white"}}>
	            				<i style={{color:"black"}} className="material-icons">delete</i>
	            			</button>
	            			<button title='Edit' className="waves-effect waves-white btn-small" style={{background : "white"}} onClick={() => props.handleEdit(number._id)} >
	            				<i style={{color:"black"}} className="material-icons">edit</i>
	            			</button>
	            		</span> 
	            	} 
            	</td>  
            }
        </tr>
	);
	return (
		<table className="highlight centered responsive-table" style={{borderCollapse: 'collapse'}}>
        <thead>
          <tr>
              <th>Book Name</th>
              <th>Author Name</th>
              <th>Price</th>
              <th>Description</th>
              <th>Status</th>
              <th>Available On</th>
              <th>Action</th>
          </tr>
        </thead>
	    <tbody>
	    	{listItems}
	    </tbody>
      </table>
	);
}

export default Listing;


// css 

/*.grid-container {
  display: grid;
  grid-template-columns: auto auto auto;
  padding: 5px;
  grid-column-gap: 30px;
  grid-row-gap: 50px;
  text-align: center;
}
.grid-item {
  padding: 10px;
  font-size: 15px;
}

label {
  font-size: 15px;
  color: black;
}*/


// get books details query

dbo.collection('books').find({}).toArray(function(err,result){
   if(err) throw err;
   return res.status(200).json({data:result});
})

//app.js


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

var dbo;

var publicDir = require('path').join(__dirname,'/public');
app.use(express.static(publicDir));

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
app.use(session({secret: 'ssshhhhh',resave: true,
    saveUninitialized: true}));
sess=session;


// MongoDB Connnection 

var url = "mongodb://192.168.2.25:27017/Api";

MongoClient.connect(url,{ useUnifiedTopology: true , useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  dbo = db.db("sasi_ci");
});


// Responce Section

app.post('/register' ,function(req,res) {

  const v = new Validator(req.body, {
      email: 'required|email',
      name : 'required|alpha|minLength:4|maxLength:50',
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
        dbo.collection('user_data').findOne({email : req.body.email},
        function(err,result) {
          if(err) {
            throw err;
          }
          else {
            if(result==null) {
              dbo.collection("user_data").insertOne(myobj, function(err, res) {
              if (err) throw err;
              });
              return res.status(200).json({"Success":true});
            } else {
              errors.email="The Email is Already Exits";
              return res.status(404).json(errors);
            }
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
    dbo.collection('user_data').findOne({email : req.body.email},function(err,result){
      if(err) {
        throw err;
      } else {
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
      }
    })
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
    myobj = {
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
    dbo.collection('books').find({book_name : req.body.book_name}).toArray(function(err,result){
      var count = 0;
      if(err) {
        throw err;
      } else {
        if(result==null) {
          count=0;
        } else {
          count = result.length;
        }
      }
      if(count==0){
        data ={
          book_name:req.body.book_name,
          book_count:1,
          available_count:''
        };
        dbo.collection('book_details').insertOne(data, function(err,res){
          if(err) throw err
        });
      }
      else {
        count = count+1;
        var myquery = { book_name: req.body.book_name };
        var newvalues = { $set: { book_count: count } };
        dbo.collection("book_details").updateOne(myquery, newvalues, function(err, res) {
          if(err) throw err
        })
      }
      dbo.collection("books").insertOne(myobj, function(err, res) {
        if (err) throw err;
      });
      return res.status(200).json({"Success":true});
    });
  }
});

app.post('/delete',function(req,res){
  id = req.body.id;
  var myquery = { _id: new mongodb.ObjectID(id) };
  dbo.collection("books").deleteOne(myquery, function(err, obj) {
      if (err) throw err;
  });
  // dbo.collection('books').find({}).toArray(function(err,result) {
  //  if(err) throw err;
  //  return res.status(200).json({data:result});
  // })
  commonfunctions.get_books().then(function(result) {
          return res.status(200).json({data:result})
  });
});

app.post('/get_book',function(req,res){
  id=req.body.id;
  var myquery = { _id:new mongodb.ObjectID(id) };
  dbo.collection('books').findOne(myquery ,function(err , obj){
    if (err) throw err;
    return res.status(200).json({data : obj});
  });
});

app.post('/update_book',function(req,res){
  id = req.body.id;
  var availablity_date = '';
  if(req.body.availability_status==2) {
    availablity_date = req.body.availablity_date
  }
  var myquery = { _id: new mongodb.ObjectID(id) };
  var newvalues = { $set: { 
      'book_name': req.body.book_name,
      "description" : req.body.description,
      "availability_status" : req.body.availability_status,
      "available_date" : availablity_date,
      "auther_name" : req.body.auther_name,
      "price" : req.body.price,
    } 
  };
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
  }
  dbo.collection("books").updateOne(myquery, newvalues, function(err, result) {
    if(err) throw err
    return res.status(200).json({Success : true});
  })
});

app.post('/take',function(req,res){
  id=req.body.id;
  taken_by=req.body.taken_by;
  date=req.body.date;
  var myquery = { _id : new mongodb.ObjectID(id) }; 
  var newvalues = { $set: {
      "availability_status" : '2',
      "available_date" : date,
      "taken_by":taken_by
    }
  }
  dbo.collection("books").updateOne(myquery, newvalues, function(err, result) {
    if(err) throw err
    return res.status(200).json({Success : true});
  });
});

// Listening Section...
app.listen(3014, () => {
  console.log('The server is listening.....');
});

//end of file (app.js)



//new codes in update book details :
 

 myquerys = { book_name : results.book_name };
              newvalue = { $set : { book_count: count,available_count :result.available_count-1 } }
              commonfunctions.updateBookDetails(myquerys,newvalue).then(function(result){
                if(req.body.availability_status) {
                  myquerys = { book_name : req.body.book_name };
                  newvalue = { $set : { book_count: count,available_count :result.available_count+1 } };
                  commonfunctions.updateBookDetails(myquery,newvalue).then(function(result){
                    return res.status(200).json({Success : true});
                  })
                } else {
                  myquerys = { book_name : req.body.book_name };
                  newvalue = { $set : { book_count: count } };
                  commonfunctions.updateBookDetails(myquery,newvalue).then(function(res){
                    return res.status(200).json({Success : true});
                  })
                }
              })


// Login Page 

dbo.collection('user_data').findOne({email : req.body.email},function(err,result){
     if(err) {
       throw err;
     } else {
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
     }
    })

// Register Page

dbo.collection('user_data').findOne({email : req.body.email},
        function(err,result) {
         if(err) {
           throw err;
         }
         else {
           if(result==null) {
             dbo.collection("user_data").insertOne(myobj, function(err, res) {
             if (err) throw err;
             });
             return res.status(200).json({"Success":true});
           } else {
             errors.email="The Email is Already Exits";
             return res.status(404).json(errors);
           }
         }
        });