const MongoClient = require('mongodb').MongoClient;
const mongodb = require('mongodb');

var url = "mongodb://192.168.2.25:27017/Api";
var dbo;

MongoClient.connect(url,{ useUnifiedTopology: true , useNewUrlParser: true }, function(err, db) {
  if (err) throw err;
  dbo = db.db("sasi_ci");
});

module.exports = {
	get_books:function(){
		return new Promise(function(resolve, reject) {
			 	dbo.collection('books').find({}).toArray(function(err,result){
				if(err) {
					throw err;
				} else {
					resolve(result);
				}
			});
		}); 
	},
	deleteBook:function(myquery){
		return new Promise(function(resolve,reject){
			dbo.collection("books").deleteOne(myquery, function(err, obj) {
			    if (err) throw err;
			    resolve(true);
			});
		});
	},
	getBook:function(myquery){
		return new Promise(function(resolve,reject){
			dbo.collection('books').findOne(myquery ,function(err , obj){
				if (err) throw err;
				resolve(obj);
			});
		})
	},
	updateBook:function(myquery,newvalues){
		return new Promise(function(resolve,reject){
			dbo.collection("books").updateOne(myquery, newvalues, function(err, result) {
				if(err) throw err
				resolve(true);
			})
		})
	},
	updateTakeStatus:function(myquery,newvalues){
		return new Promise(function(resolve,reject){
			dbo.collection("books").updateOne(myquery, newvalues, function(err, result) {
				if(err) throw err
				resolve(true);
			});
		})
	},
	addBook:function(myobj){
		return new Promise(function(resolve,reject){
			dbo.collection('books').insertOne(myobj,function(err,result){
				if(err) throw err;
				resolve(result);
			})
		})
	},
	getTotalBookCount:function(book_name){
		return new Promise(function(resolve,reject){
			dbo.collection('books').find({book_name : book_name}).toArray(function(err,result){
				if(err) throw err;
				resolve(result);
			})
		})
	},
	insertBookDetails:function(data){
		return new Promise(function(resolve,reject){
			dbo.collection('book_details').insertOne(data,function(err,result){
				if(err) throw err;
				resolve(result);
			});
		});
	},
	updateBookDetails:function(myquery,newvalues){
		return new Promise(function(resolve,reject){
			dbo.collection('book_details').updateOne(myquery,newvalues,function(err,result){
				if(err) throw err;
				resolve(true);
			})
		})
	},
	getBookDetails:function(book_name){
		return new Promise(function(resolve,reject){
			dbo.collection('book_details').findOne({book_name:book_name} ,function(err,result){
				if(err) throw err;
				resolve(result);
			})
		})
	},
	decrementBookCount:function(book_name,availability_status){
		if(parseInt(availability_status)==1) {			
			return new Promise(function(resolve,reject){
				dbo.collection('book_details').updateOne({book_name:book_name},{$inc : { book_count:-1,available_count:-1 } } ,function(err,result){
					if(err) throw err;
					resolve(true);
				})
			})
		} else if(parseInt(availability_status)==2) {
			return new Promise(function(resolve,reject){
				dbo.collection('book_details').updateOne({book_name:book_name},{$inc : { book_count:-1 } } ,function(err,result){
					if(err) throw err;
					resolve(true);
				})
			})
		} else {
			return new Promise(function(resolve,reject){
				dbo.collection('book_details').updateOne({book_name:book_name},{$inc : { available_count:-1 } } ,function(err,result){
					if(err) throw err;
					resolve(true);
				})
			})
		}
	},
	incrementBookCount:function(book_name,availability_status){
		console.log(availability_status);
		if(parseInt(availability_status)!=2) {
			return new Promise(function(resolve,reject){
			dbo.collection('book_details').updateOne({book_name:book_name},{$inc : { book_count:1,available_count:1 } } ,function(err,result){
					if(err) throw err;
					resolve(true);
				})
			})	
		} else {
			return new Promise(function(resolve,reject){
			dbo.collection('book_details').updateOne({book_name:book_name},{$inc : { book_count:1 } } ,function(err,result){
					if(err) throw err;
					resolve(true);
				})
			})
		}
	},
	userLogin:function(email){
		return new Promise(function(resolve,reject){
			dbo.collection('user_data').findOne({email : email},function(err,result){
				if(err) throw err;
				resolve(result);
			})
		})
	},
	registerUser:function(myobj){
		return new Promise(function(resolve,reject){
			dbo.collection('user_data').insertOne(myobj,function(err,result){
				if(err) throw err;
				resolve(true);
			})
		})
	}
}