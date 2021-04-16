import { makeAutoObservable } from 'mobx';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { configure } from "mobx"

configure({
	enforceActions: "never",
})

class Media {

	movies = []
	tvs = []

	constructor() {
		makeAutoObservable(this)
	}
}

class MediasStore {
	media = new Media()

	addMediaToAsyncStorage = async (medias, media_type) => {
		let nouvelleListe = []

		medias.forEach(media => {
			let newObject = {
				media: media,
				inWatchlist: false,
				media_type: media_type
			}

			nouvelleListe.push(newObject)
		})

		try {
			if (media_type === 'movie')
				this.media.movies = nouvelleListe
			else
				this.media.tvs = nouvelleListe

			await AsyncStorage.setItem(`${ media_type }`, JSON.stringify(nouvelleListe))
			return nouvelleListe
		} catch (err) {
			console.error("ERROR [addMediaToWatchlist] catch: ", err)
		}
	}

	updateMediaToAsyncStorage = async (media_id, media_type, inWatchlist) => {
		let listeMiseAJour

		media_type === "movie"
			? listeMiseAJour = this.media.movies
			: listeMiseAJour = this.media.tvs

		let mediaUpdated = {}

		listeMiseAJour.map(media => {
			if (media.media.id === media_id) {
				media.inWatchlist = inWatchlist
				mediaUpdated = media
			}
		})

		try {
			if (media_type === 'movie')
				this.media.movies = listeMiseAJour
			else
				this.media.tvs = listeMiseAJour

			await AsyncStorage.setItem(`${ media_type }`, JSON.stringify(listeMiseAJour))

			return mediaUpdated
		} catch (err) {
			console.error("ERROR [updateMediaToAsyncStorage] catch: ", err)
		}
	}

	constructor() {
		makeAutoObservable(this)
	}
}

const
	mediaStore = new MediasStore()
export {
	mediaStore
}
