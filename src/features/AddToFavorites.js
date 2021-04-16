import { AddMediaToFavoriteList } from "../api/TheMovieDBApi";
import { AddFavoriteFromTmdb } from "./AddFavoriteFromTmdb";

export const AddToFavorites = async (props, media_id, media_type) => {
	const { loginStore } = props;

	await AddMediaToFavoriteList(loginStore.user.session_id, media_type, media_id)
		.then(async (GetMovieFavoriteResponse) => console.log('Le film à bien été ajouté à vos favoris : ', GetMovieFavoriteResponse.data), await AddFavoriteFromTmdb(props, media_type))
		.catch(err => console.error("GetMovieFavorite error 3 : ", err))

}
