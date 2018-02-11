
class Store {
    constructor(json) {
        const posts = this.filter(json);

        this.state = {
            view: 'hot', // | favorites
            posts: posts,
            activeHotPost: posts[0],
            activeFavoritePost: undefined,
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
    filter(json) {
        return json.data.children.map((post, i) => {
            const { data } = post;
            const { id, num_comments, title, url, permalink, thumbnail, thumbnail_height, thumbnail_width, preview, media } = data;
            const isFavorite = (i % 5 == 0);
            return {
                id, num_comments, title, url, permalink, thumbnail, thumbnail_height, thumbnail_width, preview, media, isFavorite
            }
        });
    }
    bindActions(){
        const enablePost = (post) => {
            if (this.state.view == 'hot') {
                this.state.activeHotPost = post;
            } else {
                this.state.activeFavoritePost = post;
            }
            this.notify();
        };

        const clickHome = ()=>{
            if (this.state.view == 'hot') {
                return;
            }
            this.state.view = 'hot';
            this.notify();
        };

        const clickFavorites = ()=>{
            if (this.state.view == 'favorites') {
                return;
            }
            this.state.view = 'favorites';
            this.notify();
        }

        const addToFavorites= (post)=> {
            let p = this.state.posts.filter((x) => x == post)[0]
            p.isFavorite = true;
            this.notify();
            // send network request
        };
        const removeFromFavorites = (post) => {
            let p = this.state.posts.filter((x) => x == post)[0]
            p.isFavorite = false;
            this.notify();
        }

        this.actions.enablePost = enablePost.bind(this)
        this.actions.clickHome = clickHome.bind(this)
        this.actions.clickFavorites = clickFavorites.bind(this)
        this.actions.addToFavorites = addToFavorites.bind(this)
        this.actions.removeFromFavorites = removeFromFavorites.bind(this)
    
    }
}
   
 

export default  Store;