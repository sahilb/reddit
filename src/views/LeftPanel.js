import React from 'react';
import LeftRow from './LeftRow.js';

class LeftPanel extends React.Component {
    constructor(props) {
        super(props);
        const { store } = this.props;
        const { view } = store.state;
        const getPosts = (view) => view == 'hot' ? store.state.hot : store.state.favorites;

        this.state = { posts: getPosts(view) };

        this.props.store.addListener(x => {
            const { view } = store.state;
            this.setState({ posts: getPosts(view) })
        })
    }
    render() {
        const { store } = this.props;
        return (
            <div className="left-panel">
                {this.state.posts.map(post => {
                    return <LeftRow key={post.id} post={post} store={this.props.store} />
                })}
            </div>
        );
    }
}


export default LeftPanel;
