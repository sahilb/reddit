import xhr from 'xhr';

class Store {
    constructor(hot, favorites) {

        const hotPosts = this.filter(hot ? hot.data.children : []);
        const favoritePosts = this.filter((favorites && favorites.data) ? favorites.data.children : [], true);
        favoritePosts.forEach(p => {
            const pHot = hotPosts.find(post => post.id == p.id)
            if (pHot) {
                pHot.isFavorite = true;
            }
        })

        this.state = {
            view: 'hot', // | favorites
            favorites: favoritePosts,
            hot: hotPosts,
            activeHotPost: hotPosts[0],
            activeFavoritePost: (favoritePosts && favoritePosts.length) ? favoritePosts[0] : undefined,
            isLoggedIn: true
        }

        this.listeners = [];
        this.actions = {};
        this.bindActions()
    }
    addListener(listener) {
        this.listeners.push(listener);
    }
    notify() {
        this.listeners.forEach(listener => listener(this))
    }
    filter(jsonPosts, isFavorite) {
        return jsonPosts.map((post, i) => {
            const { data } = post;
            const { id, num_comments, title, url,
                permalink, thumbnail, thumbnail_height,
                thumbnail_width, preview, media, name
            } = data;
            isFavorite = !!isFavorite;
            let image = '';
            let video = '';
            let source = '';
            let previewType = '';
            let previewUrl = '';
            try {
                source = data.preview.images[0].variants.mp4 ? data.preview.images[0].variants.mp4.source.url : '';
            } catch (e) { }

            try {
                video = data.media.reddit_video.fallback_url;
            } catch (e) { }

            try {
                image = data.preview.images[0].source.url;
            } catch (e) { }

            if (source) {
                source = source.replace(/amp;/g, '');
                previewType = 'video'
                previewUrl = source;
            } else if (video) {
                previewType = 'video'
                previewUrl = video
            } else {
                previewType = 'image';
                if (image.length == 0) {
                    previewUrl = './no-preview.jpg'
                } else {
                    previewUrl = image;
                }
            }

            return {
                id, num_comments, title,
                url, permalink, thumbnail, thumbnail_height, thumbnail_width,
                isFavorite, previewUrl, previewType, name
            }
        });
    }
    bindActions() {
        const enablePost = (post) => {
            if (this.state.view == 'hot') {
                this.state.activeHotPost = post;
            } else {
                this.state.activeFavoritePost = post;
            }
            this.notify();
        };

        const clickHome = () => {
            if (this.state.view == 'hot') {
                return;
            }
            this.state.view = 'hot';
            this.notify();
        };

        const clickFavorites = () => {
            if (this.state.view == 'favorites') {
                return;
            }
            this.state.view = 'favorites';
            this.notify();
        }

        const addToFavorites = (post) => {
            var x = this.state.hot.filter(p => p.id === post.id)
            if (x.length) {
                x[0].isFavorite = true;
            }
            this.state.favorites.push(post);
            this.notify();
            this.sendToServer(post.name, true, () => { })
        };
        const removeFromFavorites = (post) => {
            var x = this.state.hot.filter(p => p.id === post.id)
            if (x.length) {
                x[0].isFavorite = false;
            }
            const { activeFavoritePost } = this.state;
            if (activeFavoritePost && activeFavoritePost.id == post.id) {
                this.state.activeFavoritePost = undefined;
            }
            this.state.favorites = this.state.favorites.filter(p => p.id !== post.id);
            this.notify();
            this.sendToServer(post.name, false, () => { })
        }

        this.actions.enablePost = enablePost.bind(this)
        this.actions.clickHome = clickHome.bind(this)
        this.actions.clickFavorites = clickFavorites.bind(this)
        this.actions.addToFavorites = addToFavorites.bind(this)
        this.actions.removeFromFavorites = removeFromFavorites.bind(this)

    }
    sendToServer(postId, fav, callback) {
        xhr({
            method: 'post',
            uri: '/updatePost?name=' + postId + '&enable=' + fav,
            headers: { 'Content-Type': 'application/json' }
        }, callback)
    }
}



export default Store;