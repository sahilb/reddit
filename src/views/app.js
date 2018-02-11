import React from 'react';
import HeaderBar from './header.js'
import Content from './Content';
import Store from './../Store'


class App extends React.Component {
    constructor(props) {
        super(props);
        this.store = new Store(this.props.json);
        console.log(this.props);
    }
     
    render() {
        return(
            <div> 
                <HeaderBar store={this.store}/>
                <Content store={this.store}/>
            </div>
        );
    }    
}



export default App;
