import React from 'react';
import {Redirect , Route} from 'react-router-dom';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

var data = cookies.get('User');
const Privateroute = ({component:Component,...rest}) => (
	<Route 
		{...rest}
		render={props=> data!=='undefined' ? ( <Component {...props} {...rest} /> ) : ( <Redirect to={{ pathname:"/" }} /> )}
	/>
)

export default Privateroute;