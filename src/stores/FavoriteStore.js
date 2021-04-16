import { makeAutoObservable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configure } from "mobx"

configure({
    enforceActions: "never",
})

class Favorites {
    favoritesTv = []

    favoritesMovie = []

    constructor() {
        makeAutoObservable(this)
    }
}

class FavoritesStore {
    favorites = new Favorites()

    addFavoritesFromTmdbToAsyncStorage = async (favoritesFromTmdb, media_type) => {
        try {
            await AsyncStorage.setItem(`${media_type}-fav`, JSON.stringify(favoritesFromTmdb, media_type))
        } catch (err) {
            console.error("ERROR [addMediaToFavorites] catch: ", err)
        }
    }

    getMediaInFavorites = async (media_type) => {
        try {
            const jsonValue = await AsyncStorage.getItem(`${media_type}-fav`)

            if (jsonValue !== null) {
                if (media_type === 'tv')
                    this.favorites.favoritesTv = JSON.parse(jsonValue)
                else
                    this.favorites.favoritesMovie = JSON.parse(jsonValue)
                return JSON.parse(jsonValue)
            } else {
                this.favorites.favoritesTv = []
                this.favorites.favoritesMovie = []
                return "ERROR"
            }
        } catch (e) {
            console.error("ERROR [getMediaInFavorites] catch: ", e)
        }
    }

    constructor() {
        makeAutoObservable(this)
    }
}

const favoritesStore = new FavoritesStore()
export { favoritesStore }
