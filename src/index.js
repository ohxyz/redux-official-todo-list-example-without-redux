import React from 'react';
import ReactDOM from 'react-dom';

let bridge = {
	
	todoList: [],
	selectedFilterName: 'All'
};

class App extends React.Component {
	
	constructor() {
		
		super();
		this.handleAddTodo = this.handleAddTodo.bind( this );
		this.handleFilter = this.handleFilter.bind( this );
		
		this.todoList = bridge.todoList;
		this.state = {
			
			todoList: this.todoList
		};
	}
	
	handleAddTodo( todo ) {
		
		this.todoList.push( todo );
		this.setState( {
			
			todoList: this.todoList
		} );
	}
	
	handleFilter() {
		
		let filterName = bridge.selectedFilterName;
		
		if ( filterName === 'All' ) {
			
			this.todoList = bridge.todoList;
			
		} 
		else if ( filterName === 'Completed' ) {
			
			this.todoList = bridge.todoList.filter( t => t.completed );
			
		}
		else if ( filterName === 'Active' ) {
			
			this.todoList = bridge.todoList.filter( t => !t.completed )
			
		}
		
		this.setState( {
			
			todoList: this.todoList
			
		} );
		
	}
	
	render() {
		
		return (
			<div>
				<AddTodo onAddTodo={ this.handleAddTodo } />
				<VisibleTodoList 
					todoList={ this.todoList } 
					onToggleTodo={ this.handleFilter }
				/>
				<Footer onFilter={ this.handleFilter } />
			</div>
		);
	}
}
	
class AddTodo extends React.Component {
	
	constructor() {
		
		super();
		this.handleSubmit = this.handleSubmit.bind( this );
		this.handleChange = this.handleChange.bind( this );
		
		this.todo = null;
		this.inputBoxElement = null;

	}
	
	handleSubmit( event ) {
		
		event.preventDefault();
		this.inputBoxElement.value = '';
		this.props.onAddTodo( this.todo );
	}
	
	handleChange( event ) {
		
		this.inputBoxElement = event.target;
		
		this.todo = {
			text:  this.inputBoxElement.value,
			completed: false
		};
	}
	
	render() {
		
		return (
			<form onSubmit={ this.handleSubmit }>
				<input type="text" onChange={ this.handleChange } />
				<button type="submit">Add Todo</button>
			</form>
		);
	}
}

class VisibleTodoList extends React.Component {
	
	constructor( props ) {
		
		super( props );
		this.todoList = props.todoList;
		this.handleClick = this.handleClick.bind( this );
		
		this.state = {
			
			todoList: this.todoList
		}
		
	}
	
	getTextDecoration( todo ) {
		
		return todo.completed === true
				? 'line-through'
				: 'none';
	}
	
	handleClick( event, todo ) {
		
		todo.completed = !todo.completed;

		event.target.style.textDecoration 
			 = this.getTextDecoration( todo )
		
		this.props.onToggleTodo();
	}

	render() {
		
		this.todoList = this.props.todoList;
		
		return (
			<ul>
			{	
				this.todoList.map( ( todo, index ) => {
					
					return (
						<li key={ index }
							style={ { 
							
								textDecoration: this.getTextDecoration( todo )
				            } }
							
							onClick={ ( event ) => { 
							
								this.handleClick( event, todo );
							} }
						>
							{ todo.text }
						</li>
					);
				} )
			}
			</ul>
		);
	}
}

class Footer extends React.Component {
	
	constructor() {
		
		super();
		this.handleClick = this.handleClick.bind( this );
		
		this.activeStyle={
			textDecoration: 'none',
			color: 'black'
		};
		
		this.links = [ 'All', 'Active', 'Completed' ];
	}
	
	handleClick( event ) {
		
		event.preventDefault();
		let filterName = event.target.textContent;
		bridge.selectedFilterName = filterName;
		
		this.props.onFilter();
	}
	
	render() {
		
		return (
			<div onClick={ this.handleClick } >
				Show: 
				{ 
					this.links.map( linkName => { 
						
						let style = linkName === bridge.selectedFilterName
							? this.activeStyle
							: {}
						
						return <a key={ linkName} href="/" style={ style } >{ linkName }</a>
					} )
				
				}
			</div>
		);
			
	}
}

ReactDOM.render( <App />, document.getElementById( 'root' ) );
