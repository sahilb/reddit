import React from 'react';

class App extends React.Component {
    constructor(props) {
        super(props);
    }
    onClick() {
        console.log('clicked')
    }
    render() {
        const fruits = this.props.fruits.map((fruit, i) => {
            return <li onClick={this.onClick.bind(this)} key={i}> {fruit} </li>
        })
        return (
            <ul>
                {fruits}
            </ul>
        )
    }
}
 

export default App;
