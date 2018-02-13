import React from 'react';
import LeftPanel from './LeftPanel.js';
import RightPanel from './RightPanel.js';

class Content extends React.Component {
    constructor(props) {
        super(props);
        const { store } = this.props;
        this.state = this.getPosts(store.state);

        store.addListener(() => {
            this.setState(this.getPosts(store.state))
        })

    }
    getPosts(storeState) {
        const { view } = storeState;
        let posts,
            activePost;

        if (storeState.view === 'hot') {
            posts = storeState.hot;
            activePost = storeState.activeHotPost;
        } else {
            posts = storeState.favorites;
            activePost = storeState.activeFavoritePost;
        }
        return { posts, activePost }
    }
    render() {
        return (
            <div className="content">
                <LeftPanel store={this.props.store} />
                <RightPanel post={this.state.activePost} />
            </div>
        );
    }
}


export default Content;
