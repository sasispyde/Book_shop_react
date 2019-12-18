import React from 'react';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router';
import Navbar from './Navbar';
import axios from './axios';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const cookies = new Cookies();

var data;
var fields;
class Add extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      	auth:false,
	      	fields: {
		      	'book_name':'',
		      	'auther_name' :'',
		      	'price':'',
		      	'image':'',
		      	'description':'',
		      	'available_date':new Date(),
		      	'availability_status':'',
		      	'show':false
		    },
	      	errors: {},
	      	redirect:false,
	    }
	}

	componentWillMount() {
		data = cookies.get('User');
		if(typeof data==='undefined')
		{
			this.setState({
				auth:true
			});
		} else {
			this.setState({
				auth:false
			});
		}
	}

	componentDidMount() {

		if(typeof this.props.obj != "undefined") {
			if(this.props.obj.data.available_date === '') {
				var d = new Date();			 
			} else {
				d = new Date(this.props.obj.data.available_date);			 
			}
  			this.props.obj.data.available_date = d;
  			fields = this.props.obj.data;
			if(parseInt(this.props.obj.data.availability_status) === 2) {
				this.setState({
					show:true,
					fields : this.props.obj.data
				})
			} else {
				this.setState({
					fields : this.props.obj.data
				})
			}
		}
	}

	componentWillUnmount() {
		fields="";
		this.setState({
			auth:false,
	      	fields: {
		      	'book_name':'',
		      	'auther_name' :'',
		      	'price':'',
		      	'image':'',
		      	'description':'',
		      	'available_date':new Date(),
		      	'availability_status':'',
		      	'show':false
		    },
	      	errors: {},
	      	redirect:false,
		})
	}

	async contactSubmit(e) {
	    e.preventDefault();
	    if(this.handleValidation()){
		    let data={
		        "book_name":fields['book_name'],
		        "auther_name":fields['auther_name'],
		        'price':fields['price'],
		        'availability_status':fields['availability_status'],
		        'description':fields['description'],
		        'availablity_date':fields['available_date']
		    };
		    axios.post('/add_books' ,data, { headers: {'Accept': 'application/json'}})
		    .then(responce => {
		    	this.setState({ 
		    		redirect: true,
		    		fields:data,
		    		errors:"" 
		    	})
			})
			.catch(error => {
				this.setState({
					errors : error.response.data
				})
			})
	    }
	}

	handleChange(field, e) {
	    fields = this.state.fields;
	    fields[field] = e.target.value;
	    this.setState({
	    	fields:fields,
	    });
	    if(field==='availability_status')
	    {
	    	if(parseInt(e.target.value)!==1)
	    	{	    		
		    	this.setState({
		    		show:true
		    	})
	    	}
	    	else
	    	{
	    		this.setState({
		    		show:false
		    	})
	    	}
	    }
	}

	handleGoBack() {
		this.setState({
			redirect:true
		},() =>{
			this.props.handleCancel()
		})
	}

	handleUpdate(id) {
		if(this.handleValidation()){
			let data={
		        "book_name":fields['book_name'],
		        "auther_name":fields['auther_name'],
		        'price':fields['price'],
		        'availability_status':fields['availability_status'],
		        'description':fields['description'],
		        'availablity_date':fields['available_date'],
		        'id':id
		    };
		    axios.post('/update_book' ,data, { headers: {'Accept': 'application/json'}})
		    .then(responce => {
		    	this.setState({ 
		    		redirect: true,
		    		fields:data,
		    		errors:"" 
		    	},()=>{
		    		this.props.handleCancel()
		    	})
			})
			.catch(error => {
				this.setState({
					errors : error.response.data
				})
			})
		}
	}

	handleValidation() {
	    fields = this.state.fields;
	    let errors = {};
	    let formIsValid = true;

	    //Name Valiadtion (Client Side)
	    if(!fields["book_name"] || fields["book_name"]===''){
	      formIsValid = false;
	      errors["book_name"] = "Please Enter Your Name";
	    }
	    
	    //Auther Name Valiadtion (Client Side)
		if(!fields["auther_name"] || fields["auther_name"]===''){
	      formIsValid = false;
	      errors["auther_name"] = "Please Enter Auther Name";
	    } else {
		    if(typeof fields["auther_name"] !== "undefined"){
		      var auther_name = fields["auther_name"].replace(/\s/g,'');
			    if(!auther_name.match(/^[a-zA-Z]+$/)){
			       	formIsValid = false;
			        errors["auther_name"] = "Only letters Are Allowed";
			    }       
		    }
		}

		//Price Valiadtion (Client Side)
	    if(!fields["price"]){
	      formIsValid = false;
	      errors["price"] = "Please Enter The Price";
	    } else {
		    if(typeof fields["price"] !== "undefined") {
		      	if(!fields["price"].match(/[1-9]/g)) {
		        	formIsValid = false;
		        	errors["price"] = "Only Numbers Are Allowed";
		      	}       
		    }
		}

		//Availability Status Valiadtion (Client Side)
		if(!fields["availability_status"]){
	      formIsValid = false;
	      errors["availability_status"] = "Please Check The Availablity Status";
	    }

	    //Availability Date Valiadtion (Client Side)
	    if(fields["availability_status"]&&parseInt(fields["availability_status"])===0)
	    {
		   	if(!fields['available_date']){
		      formIsValid = false;
		      errors["available_date"] = "Please Select The Date";
		    }
	    }

	   	if(!fields["description"] || fields["description"]==='') {
	      formIsValid = false;
	      errors["description"] = "Please Enter Your Name";
	    }

	    this.setState({errors: errors});
	    return formIsValid;
	}

	handleDate = date => {

	    fields['available_date']=date;
	  	this.setState({
	    	fields:fields,
	    });
	};

	render() {

		if (this.state.auth) {
	    	return <Redirect to='/' />;
	    }
	    if(data.data.data.user_type!=='A' || this.state.redirect) {
	    	return <Redirect to='/home' />;
	    }
		return (
			<div>
				{
					typeof this.props.obj =="undefined" &&
					<Navbar />
				}
				<div className="row">
				  	<center><h3>{typeof this.props.obj !="undefined" ? 'Edit Book' : 'Add Book'}</h3></center>
					<div className="center col s12">
				        <form name="contactform" id="details_form" className="contactform" onSubmit= {this.contactSubmit.bind(this)}>
				          	<div className="col-md-12">
				            	<div className="input-field col s12">
					            	<input ref="book_name" id='book_name' type="text" size="30"  onChange={this.handleChange.bind(this, "book_name")} value={this.state.fields.book_name} />
					            	<label className = { typeof this.props.obj !="undefined" ? "active" : '' } htmlFor="book_name">Book Name</label>
					              	<p className="error">{this.state.errors["book_name"]}</p>
				              	</div>
				              	<div className="input-field col s12">
					            	<input ref="auther_name" id='auther_name' type="text" size="30"  onChange={this.handleChange.bind(this, "auther_name")} value={this.state.fields.auther_name} />
					            	<label className = { typeof this.props.obj !="undefined" ? "active" : '' } htmlFor="auther_name">Auther Name</label>
					              	<p className="error">{this.state.errors["auther_name"]}</p>
				              	</div>
				              	<div className="input-field col s12">
						            <input refs="price" id='price' type="text" size="30" onChange={this.handleChange.bind(this, "price")} value={this.state.fields.price} />
					              	<label className = { typeof this.props.obj !="undefined" ? "active" : '' } htmlFor="price">price</label>
					              	<p className="error">{this.state.errors["price"]}</p>
					            </div>
					            <div className="input-field col s12">
					            <label>Availablity Status</label>
					            <label style={{marginLeft: "180px"}}>
								    <input className="with-gap" name="availability_status" value="1" checked = {parseInt(this.state.fields.availability_status) === 1 ? true : false} type="radio" onChange={this.handleChange.bind(this, "availability_status")} />
								    <span>Yes</span>
							    </label>
							    <label style={{marginLeft:"300px"}}>
							        <input className="with-gap" name="availability_status" value="2" checked = {parseInt(this.state.fields.availability_status) === 2 ? true : false} type="radio" onChange={this.handleChange.bind(this, "availability_status")} />
							        <span>No</span>
							    </label>			              	
					            </div>
					            <p className="error">{this.state.errors["availability_status"]}</p>
					            { 
					            	this.state.show && 
						            	<div className="input-field col s12" style={{marginTop: '-10px'}}>
						            		<label style={{marginTop:"20px"}}>Available Date</label>
					              			<DatePicker
										  	selected={this.state.fields.available_date}
										  	onChange={this.handleDate} //only when value has changed
											/>
											<p className="error">{this.state.errors["available_date"]}</p>
										</div>
					         	}
					         	<div className="input-field col s12">
					            	<input ref="description" id='description' type="text" size="50"  onChange={this.handleChange.bind(this, "description")} value={this.state.fields.description} />
					            	<label className = { typeof this.props.obj !="undefined" ? "active" : '' } htmlFor="description">Description</label>
					              	<p className="error">{this.state.errors["description"]}</p>
				              	</div>
				              	{ 
				              		typeof this.props.obj =="undefined" &&
					              	<div className="input-field col s12">
					              	  <button className="btn waves-effect waves-light" type="submit" name="action">Add Book
									    <i className="material-icons right">send</i>
									  </button>
									</div>
								}
								{
									typeof this.props.obj !="undefined" &&
									<div className="input-field col s12">
										<button onClick={this.handleUpdate.bind(this,this.props.obj.id.id)} style={{float:"left"}} className="btn waves-effect waves-light" type="button" name="cancel">Update
									    	<i className="material-icons right">update</i>
									  	</button>
					              	  	<button onClick={this.handleGoBack.bind(this)} style={{float:"right"}} className="btn waves-effect waves-light" type="button" name="cancel">Cancel
									    	<i className="material-icons right">cancel</i>
									  	</button>
									</div>
								}
				          	</div>
				        </form>
				    </div>
				</div>
			</div>
		);
	}
}

export default Add;