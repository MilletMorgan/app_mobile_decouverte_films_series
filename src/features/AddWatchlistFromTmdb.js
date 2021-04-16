import { GetRequestToken, GetWatchlist, ValidateAuthentication } from "../api/TheMovieDBApi";
import { GetMediaFromAsyncStorage } from "./GetMediaFromAsyncStorage";

export const AddWatchlistFromTmdb = async (props, media_type) => {
	let new_media_type = media_type

	if (media_type === 'movie')
		new_media_type = 'movies'

	return await GetRequestToken()
		.then(GetRequestTokenResponse => ValidateAuthentication(GetRequestTokenResponse.data.request_token, props.loginStore.user.username, props.loginStore.user.password)
			.then(() => GetWatchlist(props.loginStore.user.session_id, new_media_type)
				.then(GetMovieWatchListResponse => {
					props.watchlistStore.addWatchlistFromTmdbToAsyncStorage(GetMovieWatchListResponse.data.results, media_type)
						.then(() => {
							props.watchlistStore.getMediaInWatchlist(media_type).then(() => {
								return "ok"
							})
							GetMediaFromAsyncStorage(props, media_type)
						})
						.catch(err => console.error("ERROR [props.watchlistStore.addMediaToWatchlist] then catch: ", err))
				})
				.catch(err => console.error("GetMovieWatchList error 2 : ", err))
			)
			.catch(err => console.error("ValidateAuthentication error : ", err))
		)
}
