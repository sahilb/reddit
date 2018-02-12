import React from 'react';

class Media extends React.Component {
    extractUrl() {
        const { post } = this.props;
        let image = '';
        let video = '';
        let source = '';
        try {
            source = post.preview.images[0].variants.mp4 ? post.preview.images[0].variants.mp4.source.url : '';
            image = post.preview.images[0].source.url;
            video = post.media.reddit_video.fallback_url;
        } catch (e) {
            image = image || '';
            video = video || '';
        }

        let media = video.length ? video : image;

        if (source.length) {
            source = source.replace(/amp;/g, '');
        }
        if(image.length == 0){
            image = './no-preview.jpg'
        }
        return {
            source, video, image
        }
    }
    render() {
        const { previewType, previewUrl } = this.props.post;
        const [width, height] = [640, 480];
        return (
            <div className="media">

                {previewType == 'video' ? (
                    <video src={previewUrl} height={height} width={width} loop="loop" controls muted={true} />
                ) : (
                         
                    <img height={height} width={width} src={previewUrl} />
                            
                    )}

            </div>
        )
    }
}

export default Media;