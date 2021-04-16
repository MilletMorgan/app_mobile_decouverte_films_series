import {
	GetRequestToken,
	RemoveMediaToWatchlist,
	ValidateAuthentication
} from "../api/TheMovieDBApi";
import { AddWatchlistFromTmdb } from "./AddWatchlistFromTmdb";

export const RemoveMediaFromTmdbWatchlist = (props, media_type, media_id) => {
	GetRequestToken()
		.then(GetRequestTokenResponse => {
			ValidateAuthentication(GetRequestTokenResponse.data.request_token, props.loginStore.user.username, props.loginStore.user.password)
				.then(() => RemoveMediaToWatchlist(props.loginStore.user.session_id, media_type, media_id)
					.then(() => {
						AddWatchlistFromTmdb(props, media_type).then(() => {
						})
						props.mediaStore.updateMediaToAsyncStorage(media_id, media_type, false)
							.then(() => {
							})
					})
					.catch(err => console.error("RemoveMediaToWatchlist error 1 : ", err)))

				.catch(err => console.error("ValidateAuthentication error : ", err))
		})
		.catch(err => console.error("GetRequestToken ERROR : ", err))
}
