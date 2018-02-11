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
            posts = storeState.posts;
            activePost = storeState.activeHotPost;
        } else {
            let { activeFavoritePost } = storeState
            posts = storeState.posts.filter(x => x.isFavorite);
            if (activeFavoritePost && posts.includes(activeFavoritePost)) {
                activePost = activeFavoritePost
            }
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
