import React from 'react';
import LeftRow from './LeftRow.js';

class LeftPanel extends React.Component {
    constructor(props) {
        super(props);
        const {store} = this.props;
        this.state = {
            posts: store.state.posts
        }
        this.props.store.addListener(x =>{ 
            const {view} = store.state;
            var posts = (view == 'hot') ? store.state.posts : store.state.posts.filter(x => x.isFavorite);
            this.setState({posts: posts})
        })
    }
    render() {
        const {store} = this.props;
        return (
            <div className="left-panel">
                 {this.state.posts.map(post => {
                    return <LeftRow key={post.id} post={post} store={this.props.store}/>
                 })}
            </div>
        );
    }
}


export default LeftPanel;
