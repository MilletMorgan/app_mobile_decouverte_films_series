import { AddMediaToWatchlist, GetRequestToken, ValidateAuthentication } from "../api/TheMovieDBApi";

export const AddToWatchList = (props, media, media_type, media_id, updateList) => {

	GetRequestToken()
		.then(GetRequestTokenResponse => ValidateAuthentication(GetRequestTokenResponse.data.request_token, props.loginStore.user.username, props.loginStore.user.password)
			.then(() => {
					AddMediaToWatchlist(props.loginStore.user.session_id, media_type, media_id)
						.then(() => {
							props.mediaStore.updateMediaToAsyncStorage(media_id, media_type, true)
								.then(listeMiseAJour => updateList(listeMiseAJour))
								.catch(e => console.error("ERROR", e))
						})
						.catch(err => console.error("AddMediaToWatchlist error 1 : ", err))
				}
			)
			.catch(err => console.error("ValidateAuthentication error : ", err)))
		.catch(err => console.error("GetRequestToken ERROR : ", err))
}
