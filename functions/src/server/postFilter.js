'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
function filter(json) {
    return json.data.children.map(function (post, i) {
        var data = post.data;
        var id = data.id,
            num_comments = data.num_comments,
            title = data.title,
            url = data.url,
            permalink = data.permalink,
            thumbnail = data.thumbnail,
            thumbnail_height = data.thumbnail_height,
            thumbnail_width = data.thumbnail_width,
            preview = data.preview,
            media = data.media;

        var isFavorite = i % 5 == 0;

        var image = '';
        var video = '';
        var source = '';
        var previewType = '';
        var previewUrl = '';
        try {
            source = data.preview.images[0].variants.mp4 ? data.preview.images[0].variants.mp4.source.url : '';
        } catch (e) {}

        try {
            video = data.media.reddit_video.fallback_url;
        } catch (e) {}

        try {
            image = data.preview.images[0].source.url;
        } catch (e) {}

        if (source) {
            source = source.replace(/amp;/g, '');
            previewType = 'video';
            previewUrl = source;
        } else if (video) {
            previewType = 'video';
            previewUrl = video;
        } else {
            previewType = 'image';
            if (image.length == 0) {
                previewUrl = './no-preview.jpg';
            } else {
                previewUrl = image;
            }
        }

        return {
            id: id, num_comments: num_comments, title: title,
            url: url, permalink: permalink, thumbnail: thumbnail, thumbnail_height: thumbnail_height, thumbnail_width: thumbnail_width,
            isFavorite: isFavorite, previewUrl: previewUrl, previewType: previewType
        };
    });
}

exports.default = filter;