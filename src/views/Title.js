import React from 'react';

class Title extends React.Component {
    constructor(post) {
        super(post);
    }
    render() {
        const { post } = this.props
        const url = "https://www.reddit.com" + post.permalink;
        return (
            <div className="title">
                <a href={url} target="_blank" >{post.title} </a>
            </div>
        );
    }
}

export default Title;