import React from 'react';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router';
import Navbar from './Navbar';
import Listing from './Listing';
import AddBooks from './Add_books';
import axios from './axios';
import Modal from "react-responsive-modal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const cookies = new Cookies();

var data;
class Home extends React.Component {

	constructor(props) {
	    super(props);
	    this.state = {
	      auth:false,
	      books:{},
	      delete:false,
	      edit:false,
	      book:{},
	      redirect:false,
	      open: false,
	      delete_modal:false,
	      date: new Date(),
	      take_id:"",
	      user_id:"",
	      delete_id:'',
	      errors:{},
	      book_name:''

	    }
	    this.handleDelete = this.handleDelete.bind(this);
	    this.handleEdit = this.handleEdit.bind(this);
	    this.handleCancel = this.handleCancel.bind(this);
	    this.handleTake = this.handleTake.bind(this);
	    this.onOpenModal = this.onOpenModal.bind(this);
	    this.onOpenDeleteModal = this.onOpenDeleteModal.bind(this);
	}

	onOpenModal = (id,book_name) => {
	    this.setState({ 
	    	open: true,
	    	take_id:id,
	    	book_name:book_name
	    });
	};

	onOpenDeleteModal = (id,book_name) => {
	    this.setState({ 
	    	delete_modal: true,
	    	delete_id:id,
	    	book_name:book_name 
	    });
	};

	onCloseModal = () => {
	    this.setState({ 
	    	open: false,
	    	delete_modal:false,
	    	book_name:'',
	    	take_id:'',
	    	delete_id:'' 
	    });
	  };

	componentDidMount() {

		data = cookies.get('User');
		if(typeof data==='undefined')
		{
			this.setState({
				auth:true,
			});
		}
		else {
			axios.get('/get_all_books',{ headers: {'Accept': 'application/json'}})
			.then((res)=>{
				this.setState({
					books:res.data.data,
					user_id:data.data.data._id
				})
			})
			.catch(err=>{
				throw err;
			})
		}
	}

	componentDidUpdate () {
	    if (this.state.redirect) {
	    	axios.get('/get_all_books',{ headers: {'Accept': 'application/json'}})
			.then((res)=>{
				this.setState({
					books:res.data.data,
					redirect:false,
					edit:false,
					id:'',
					book:{}
				})
			}).catch(err=>{
				throw err;
			})
	    }
	}

	handleEdit(id) {
		id={'id':id};
		axios.post('/get_book',id,{ headers: {'Accept': 'application/json'}})
		.then((res)=>{
			this.setState({
				edit:true,
				id:id,
				date:new Date(),
				book:res.data.data
			})
		}).catch(err=>{
			throw err;
		})
	}

	handleCancel() {
		this.setState({
			redirect:true
		})
	}

	handleTake() {
		var errors=[];
		if(this.state.date === null ){
			errors['return_date'] = "The Return Date is Required";
			this.setState({
				errors:errors
			});
		} else {
			var new_date = this.state.date;
			var old_date = new Date();
			if (new_date.getTime() < old_date.getTime()) {
				errors['return_date'] = "The Return Date Should be Greater then Current Date"
				this.setState({
					errors:errors
				});
			} else {
				var book_data = {
					id:this.state.take_id,
					taken_by: this.state.user_id,
					date:this.state.date,
					book_name:this.state.book_name,
				};
				axios.post('/take',book_data,{ headers: {'Accept': 'application/json'}})
			    .then(res => {
			    	this.setState({ 
			    		redirect:true,
			    		open:false
			    	})
				})
				.catch(err=>{
					throw err;
				})
			}
		}
	}

	handleDelete() {
		var datas = {
			'id':this.state.delete_id,
			'book_name':this.state.book_name
		};
		axios.post('/delete',datas,{ headers: {'Accept': 'application/json'}})
	    .then(res => {
	    	this.setState({ 
	    		books:res.data.data,
	    		redirect:true,
	    		delete_modal:false
	    	})
		})
		.catch(err=>{
			throw err;
		})
	}

	handleDate = date => {
	  	this.setState({
	    	date:date
	    });
	};

	render() {
		const { open } = this.state;
		const { delete_modal } = this.state;
		var Admin=false;
		if (this.state.auth) {
	    	return <Redirect to='/' />;
	    }
	    if(typeof data!= "undefined" && data.data.data.user_type==='A')
	    {
	    	Admin=true;
	    }
		return(
			<div>
				{
					this.state.edit ? <AddBooks handleCancel ={this.handleCancel} obj = { { edit:this.state.edit , data : this.state.book , id : this.state.id } } /> : <div><Navbar />
					<Listing onOpenModal={this.onOpenModal} handleEdit={this.handleEdit} data = {this.state.books} onOpenDeleteModal={this.onOpenDeleteModal} Admin={Admin} /></div>
				}
				<Modal open={open} onClose={this.onCloseModal}>
					<div style = {{ width:'500px',textAlign:'center' }}>
		          		<h2>Take Book</h2>
		          		<form name="contactform" id="details_form" className="contactform">
	              		<h5>Return Date</h5>
		            	<div className="input-field col s12" style={{marginTop: '-10px'}}>
	              			<DatePicker
	              			selected={this.state.date}
						  	onChange={this.handleDate} //only when value has changed
							/>
						</div>
						<p className="error">{this.state.errors["return_date"]}</p>
						<button onClick={()=>this.handleTake()} className="btn waves-effect waves-light" type="button" name="take">Take
							<i className="material-icons right">update</i>
						</button>
						</form>
					</div>
		        </Modal>
		        <Modal open={delete_modal} onClose={this.onCloseModal}>
					<div style = {{ width:'500px',textAlign:'center',height:"200px" }}>
						<h3 style={{color:'red'}}><center>Delete</center></h3>
		          		<h4>Are You Sure to Delete This Book</h4>	
		          		<form name="contactform" id="details_form" className="contactform">
						<button onClick={()=>this.handleDelete()} className="btn waves-effect waves-light red" type="button" name="delete">Delete
							<i className="material-icons right">delete</i>
						</button>
						</form>
					</div>
		        </Modal>
			</div>
		);
	}
}

export default Home;