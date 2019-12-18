import React from 'react';
import './css/Register.css';
import axios from './axios';
import { Redirect } from 'react-router';
import { Link } from "react-router-dom";
import Cookies from 'universal-cookie';
import InputNumber from 'react-input-just-numbers';

const cookies = new Cookies();

var fields;
class Register extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      fields: {
	      	'name':'',
	      	'email':'',
	      	'phone':'',
	      	'password':''
	      },
	      errors: {},
	      redirect:false,
	      auth:false
	    }
	}

	componentWillMount()
	{
		var data = cookies.get('User');
		if(typeof data!='undefined')
		{
			this.setState({
				auth:true
			});
		}
	}

	contactSubmit(e){
	    e.preventDefault();
	    if(this.handleValidation()){
		    let data={
		        "name":fields['name'],
		        'email':fields['email'],
		        'phone':fields['phone'],
		        'password':fields['password']
		    };
		    axios.post('/register' ,data, { headers: {'Accept': 'application/json'}})
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

	handleChange(field, e){

	    fields = this.state.fields;
	    fields[field] = e.target.value;
	    this.setState({
	    	fields:fields
	    });
	}

	handleValidation(){

	    fields = this.state.fields;
	    let errors = {};
	    let formIsValid = true;

	    //Name Valiadtion (Client Side)
	    if(!fields["name"] || fields["name"]===''){
	      formIsValid = false;
	      errors["name"] = "Please Enter Your Name";
	    }
	    else {
		    if(typeof fields["name"] !== "undefined"){
		      var name = fields["name"].replace(/\s/g,'');
			    if(!name.match(/^[a-zA-Z]+$/)){
			       	formIsValid = false;
			        errors["name"] = "Only letters Are Allowed";
			    }       
		    }
		}

		//Phone Number Valiadtion (Client Side)
	    if(!fields["phone"]){
	      formIsValid = false;
	      errors["phone"] = "Please Enter The Phone Number";
	    }
	    else{
		    if(typeof fields["phone"] !== "undefined") {
		      	if(!fields["phone"].match(/[1-9]/g)) {
		        	formIsValid = false;
		        	errors["phone"] = "Only Numbers Are Allowed";
		      	}       
		    }
		}

		//Address Validation (Client Side)
	    if(!fields["password"]){
	      formIsValid = false;
	      errors["password"] = "Please Enter The Password";
	    }

	    //Email Valiadtion (Client Side)
	    if(!fields["email"]){
	      formIsValid = false;
	      errors["email"] = "Please Enter Your Email Id";
	    }
	    else{
		    if(typeof fields["email"] !== "undefined"){
	      		let lastAtPos = fields["email"].lastIndexOf('@');
	      		let lastDotPos = fields["email"].lastIndexOf('.');
			    if (!(lastAtPos < lastDotPos && lastAtPos > 0 && fields["email"].indexOf('@@') === -1 && lastDotPos > 2 && (fields["email"].length - lastDotPos) > 2)) {
			        formIsValid = false;
			        errors["email"] = "Email is not valid";
			    }
		    }
		}
	    this.setState({errors: errors});
	    return formIsValid;
	}

	render() {
		var redirect  = this.state.redirect;

	    if (redirect) {
	    	return <Redirect to='/' />;
	    }
	    if (this.state.auth) {
	    	return <Redirect to='/home' />;
	    }
		return (
			<div className="row" style={{marginTop: '57px'}}>
		  	<center><h3>Register Form</h3></center>
		  	  <center><p className="grey-text text-darken-1">
                Already have an account? <Link to="/">Log in</Link>
              </p></center>
				<div className="center col s12">
			        <form name="contactform" id="details_form" className="contactform" onSubmit= {this.contactSubmit.bind(this)}>
			          	<div className="col-md-12">
			            	<div className="input-field col s12">
				            	<input ref="name" id='name' type="text" size="30"  onChange={this.handleChange.bind(this, "name")} value={this.state.fields.name} />
				            	<label htmlFor="name">Name</label>
				              	<p className="error">{this.state.errors["name"]}</p>
			              	</div>
			              	<div className="input-field col s12">
				              	<input refs="email" id='email' type="text" size="30"  onChange={this.handleChange.bind(this, "email")} value={this.state.fields.email} />
				              	<label htmlFor="email">Email</label>
				              	<p className="error">{this.state.errors["email"]}</p>
			              	</div>
			              	<div className="input-field col s12">
								<InputNumber size='16' value={this.state.fields.mobile}
						        onChange={this.handleChange.bind(this, "phone")}
						        />				              	
						        <label htmlFor="phone">Phone</label>
				              	<p className="error">{this.state.errors["phone"]}</p>
				             </div>
				            <div className="input-field col s12">
				              	<input refs="password" id='password' type="password" size="30"  onChange={this.handleChange.bind(this, "password")} value={this.state.fields.password} />
				              	<label htmlFor="password">Password</label>
				              	<p className="error">{this.state.errors["password"]}</p>
			              	</div>
			              	<div className="input-field col s12">
			              	  <button className="btn waves-effect waves-light" type="submit" name="action">Submit
							    <i className="material-icons right">send</i>
							  </button>
							</div>
			          	</div>
			        </form>
			    </div>
		    </div>
		);
	}
}

export default Register;