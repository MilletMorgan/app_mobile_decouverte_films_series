import { makeAutoObservable } from 'mobx';
import AsyncStorage                 from '@react-native-async-storage/async-storage';
import { configure }                from "mobx"

configure( {
	enforceActions : "never",
} )

class Watchlist {
	watchlistTv = []

	watchlistMovie = []

	constructor() {
		makeAutoObservable( this )
	}
}

class WatchlistStore {
	watchlist = new Watchlist()

	addWatchlistFromTmdbToAsyncStorage = async ( watchlistFromTmdb, media_type ) => {
		try {
			await AsyncStorage.setItem( `${media_type}`, JSON.stringify( watchlistFromTmdb, media_type ) )
		} catch ( err ) {
			console.error( "ERROR [addMediaToWatchlist] catch: ", err )
		}
	}

	getMediaInWatchlist = async (media_type) => {
		try {
			const jsonValue = await AsyncStorage.getItem( `${media_type}` )

			if ( jsonValue !== null ) {
				if (media_type === 'tv')
					this.watchlist.watchlistTv = JSON.parse( jsonValue )
				else
					this.watchlist.watchlistMovie = JSON.parse(jsonValue)
				return JSON.parse( jsonValue )
			} else {
				this.watchlist.watchlistTv = []
				this.watchlist.watchlistMovie = []
				return "ERROR"
			}
		} catch ( e ) {
			console.error( "ERROR [getMediaInWatchlist] catch: ", e )
		}
	}

	constructor() {
		makeAutoObservable( this )
	}
}

const watchlistStore = new WatchlistStore()
export { watchlistStore }
