import { addToWishlist, getWishlist, removeFromWishlist } from "./wishlist/wishlist.service";

// example
const service ={
    common: {
        addToWishlist,
        getWishlist,
        removeFromWishlist
    },
    wishlist: {
        addToWishlist,
        getWishlist,
        removeFromWishlist
    }
}

export default service;