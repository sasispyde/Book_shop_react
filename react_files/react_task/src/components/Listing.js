import React from 'react';
import './css/Listing.css';

function Listing(props) {
  	var numbers = props.data;
  	const peopleArray = Object.keys(numbers).map(i => numbers[i]);
  	if(peopleArray.length <= 0) {
  		var listItems = <h4><center></center></h4>
  	} else {
	  	listItems = peopleArray.map((number) =>
	       	<div className="box align" key={number._id}>
	       		<img src={'https://images.unsplash.com/photo-1549122728-f519709caa9c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=625&q=80'} alt="boohoo" className="img-responsive"/>
	       			<li className='align'><span className='align-span-left'>Book Name </span><span className='align-span'><b>{number.book_name.slice(0,20)+"..."}</b></span></li>
	       			<li className='align'><span className='align-span-left'> Auther Name </span><span className='align-span'><b>{number.auther_name}</b></span></li>
	       			<li className='align'><span className='align-span-left'>price </span><span className='align-span'><b>{number.price} &#8377;</b></span></li>
	       			<li className='align'><span className='align-span-left'>Description </span><span className='align-span'><b>{number.description.slice(0,20)+'...'}</b></span></li>
	       			<li className='align'><span className='align-span-left'>status </span><span className='align-span'>{ parseInt(number.availability_status) === 1 ? <b>Available</b> : <b style={{color:'red'}}>Out of Stock</b>  }</span></li>
	       			{ parseInt(number.availability_status)===2 &&
	       				<li className='align'><span className='align-span-left'>Available on </span><span className='align-span'><b>{parseInt(number.availability_status) !== 1 ? number.available_date.slice(0, 10)+' Onwards' : "-"}</b></span></li>
					}
					<li className='align'>&nbsp;</li>
					<li>{ 
		            	parseInt(number.availability_status) === 1 ? 
		            	<div className={ props.Admin ? 'align-button':'non_admin'}>
		            		<button title='Take Book' onClick={()=>props.onOpenModal(number._id,number.book_name)} className="waves-effect waves-white btn-small" style={{color:"black"}}>
		            			{ props.Admin ? <i className="material-icons" style={{color:"black"}}>book</i> :"Take Book"}
		            		</button> 
		            	{ 
		            		props.Admin && 
		            		<span>
		            			<button title='Delete' className="waves-effect waves-white btn-small" onClick={() => props.onOpenDeleteModal(number._id,number.book_name)} ><i style={{color:"black"}} className="material-icons">delete</i></button>
		            			<button title='Edit' className="waves-effect waves-white btn-small" onClick={() => props.handleEdit(number._id)} ><i style={{color:"black"}} className="material-icons">edit</i></button>
		            		</span> 
		            	} 
		            	</div>
		            	:
		            	<div className={ props.Admin?'align-button':'non_admin'}>
		            		<button title="Not Available" className="waves-effect waves-white btn-small">
		            			<i style={{color:"black"}} className="material-icons">block</i>
		            		</button>
		        			{ 
			            		props.Admin && 
			            		<span>
			            			<button title='Delete' className="waves-effect waves-white btn-small" onClick={() => props.onOpenDeleteModal(number._id,number.book_name)}>
			            				<i style={{color:"black"}} className="material-icons">delete</i>
			            			</button>
			            			<button title='Edit' className="waves-effect waves-white btn-small" onClick={() => props.handleEdit(number._id)} >
			            				<i style={{color:"black"}} className="material-icons">edit</i>
			            			</button>
			            		</span> 
			            	} 
		            	</div>  
		            }</li>
		  	</div>
		);
  	}
	return (
	    <div className="box-wrap">{listItems}</div>
	);
}

export default Listing;