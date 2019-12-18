import React from 'react';
import { Link } from "react-router-dom";
import { Redirect } from 'react-router';
import Cookies from 'universal-cookie';
import history from './history/history';
const cookies = new Cookies();

var data;
class Navbar extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      auth:false
	    }
	    this.Logout = this.Logout.bind(this);
	}

	componentWillMount() {
		data = cookies.get('User');
		if(typeof data==='undefined')
		{
			this.setState({
				auth:true
			});
		}
	}
	
	Logout() {
		cookies.remove('User');
		this.setState({
			auth:true
		})
	}

	render() {
	    var Admin=false;
		if (this.state.auth) {
	    	return <Redirect to='/' />;
	    }
	    if(data.data.data.user_type==='A')
	    {
	    	Admin=true
	    }
		return(
			<div>
				<nav>
					<ul>
						{	Admin &&
							<>						
							<li>
								<Link to='/home'>Home</Link>
							</li>
							<li>
								<Link to='/add_books'>Add Book</Link>
							</li>
							</>
						}
						<li style={{float:"right"}}>
							<Link to='#' onClick={this.Logout}>Logout</Link>
						</li>
					</ul>
				</nav>
			</div>
		)
	}
}

export default Navbar;