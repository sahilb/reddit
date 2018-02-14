import React from 'react';
import HeaderBar from './Header.js'
import Content from './Content';
import Store from './../Store'


class App extends React.Component {
    constructor(props) {
        super(props);
        const {hot, fav} = this.props
        this.store = new Store(hot, fav);
        console.log(this.props.json);
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
