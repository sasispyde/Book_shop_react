import React from 'react';
import axios from './axios';
import Cookies from 'universal-cookie';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';


const cookies = new Cookies();

var fields;
class Login extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      fields: {
	      	'email':'',
	      	'password':'',
	      },
	      errors: {},
	      redirect:false,
	      auth:false
	    }
	}

	componentWillMount()
	{

		var data = cookies.get('User');
		// cookies.remove('User');
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
		        "email":fields['email'],
		        'password':fields['password']
		    };
		    axios.post('/login' ,data, { headers: {'Accept': 'application/json'}})
		    .then((res)=>{cookies.set('User', res, { path: '/',maxAge :36000000 });this.setState({
		    	auth:true
		    })})
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

		//Password Number Valiadtion (Client Side)
	    if(!fields["password"]){
	      formIsValid = false;
	      errors["password"] = "Please Enter The Password Number";
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
		if(this.state.auth)
		{
			return <Redirect to='/home' />;
		}
		return (
			<div className="row" style={{marginTop: '121px'}}>
		  	<center><h3>Login</h3></center>
				<center><p className="grey-text text-darken-1">
	                If You have an Account Not Yet? <Link to="/register">Register</Link>
	             </p></center>
				<div className="center col s12">
			        <form name="contactform" id="details_form" className="contactform" onSubmit= {this.contactSubmit.bind(this)}>
			          	<div className="col-md-12">
			              	<div className="input-field col s12">
				              	<input refs="email" id='email' type="text" size="30"  onChange={this.handleChange.bind(this, "email")} value={this.state.fields.email} />
				              	<label htmlFor="email">Email</label>
				              	<p className="error">{this.state.errors["email"]}</p>
			              	</div>
			              	<div className="input-field col s12">
				              	<input refs="password" id='password' type="password" size="30"  onChange={this.handleChange.bind(this, "password")} value={this.state.fields.password} />
				              	<label htmlFor="password">Password</label>
				              	<p className="error">{this.state.errors["password"]}</p>
				             </div>
			              	<div className="input-field col s12">
			              	  <button className="btn waves-effect waves-light" type="submit" name="action">Login
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

export default Login;