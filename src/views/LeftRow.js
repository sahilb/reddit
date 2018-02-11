import React from 'react';

class LeftRow extends React.Component {
    constructor(props) {
        super(props);

        const { store, post } = this.props;
        this.state = {
            isFavorite: post.isFavorite
        }
        store.addListener((x) => {
            let p = store.state.posts.filter(x => x=== post)[0];

            this.setState({
                isFavorite: p.isFavorite
            })
        })
    }
    onRowClicked() {
        this.props.store.actions.enablePost(this.props.post)
    }
    splitTitle() {
        var title = this.props.post.title;
        var max = 41;
        if (title.length > max) {
            title = title.slice(0, max);
            title = title + '...'
        }
        return title;
    }
    getDimensions(post) {
        let height = 54;
        let width = 54;
        if (!post.thumbnail || post.thumbnail == 'self') {
            post.thumbnail = './reddit_logo.png'
            height = 54;
            width = 54;
        } else if (post.thumbnail && post.thumbnail_height && post.thumbnail_height >= 58) {
            height = 54;
            width = 54
        } else {
            height = post.thumbnail_height || 54
            width = post.thumbnail_width || 54
        }

        return { height, width }
    }

    onFavoriteToggled() {
        const { post, store } = this.props;
        if (this.state.isFavorite) {
            store.actions.removeFromFavorites(post);
        } else {
            store.actions.addToFavorites(post);
        }
    }
    isActive(){
        const {store} = this.props;
        const {state} = store;
        const activePost = state.view == 'hot' ? state.activeHotPost : state.activeFavoritePost;
        return activePost === this.props.post;
    }
    render() {
        const { post } = this.props;
        const url = "https://www.reddit.com" + post.permalink;
        const { height, width } = this.getDimensions(post);
        const favClassName = (this.state.isFavorite ? 'favorite-icon-enabled' : 'favorite-icon') + ' row-section';
        
        const rowClassName = 'left-row ' + (this.isActive() ? 'active-row' : ''  );

        return (
            <div className={rowClassName}  key={post.id} onClick={this.onRowClicked.bind(this)}>
                <div className="thumbnail row-section">
                    <img alt="thumbnail" src={post.thumbnail} height={height} width={width} />
                </div>
                <div className={favClassName} onClick={this.onFavoriteToggled.bind(this)}></div>
                <div className="row-section" >

                    <div className="title">
                        <div>{this.splitTitle()}</div>
                    </div>
                    <div className="comments">
                        {post.num_comments} comments
                    </div>
                </div>
            </div>
        )
    }
}

export default LeftRow;

