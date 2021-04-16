import { GetRequestToken, RemoveMediaToWatchlist, ValidateAuthentication } from "../api/TheMovieDBApi";

export const RemoveFromWatchlist = (props, media, media_type, media_id, updateList) => {
	GetRequestToken().then(GetRequestTokenResponse => {
		ValidateAuthentication(GetRequestTokenResponse.data.request_token, props.loginStore.user.username, props.loginStore.user.password).then(() =>
			RemoveMediaToWatchlist(props.loginStore.user.session_id, media_type, media_id).then(() => {
				props.mediaStore.updateMediaToAsyncStorage(media_id, media_type, false)
					.then(listeMiseAJour => updateList(listeMiseAJour))
					.catch(e => console.error("ERROR", e))})
				.catch(err => console.error("GetMovieWatchList ERROR 1 : ", err)))
			.catch(err => console.error("ValidateAuthentication error : ", err))
	}).catch(err => console.error("GetRequestToken TEST ERROR : ", err))
}
