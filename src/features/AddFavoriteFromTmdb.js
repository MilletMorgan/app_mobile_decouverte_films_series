import { GetRequestToken, GetFavoriteList, ValidateAuthentication } from "../api/TheMovieDBApi";
import { GetFavoriteFromAsyncStorage } from "./GetFavoriteFromAsyncStorage";

export const AddFavoriteFromTmdb = async (props, media_type) => {
    let new_media_type = media_type
    if (media_type === 'movie')
        new_media_type = 'movies'

    return await GetFavoriteList(props.loginStore.user.session_id, new_media_type)
        .then(async (GetMovieFavoriteResponse) => {
            await props.favoritesStore.addFavoritesFromTmdbToAsyncStorage(GetMovieFavoriteResponse.data.results, media_type)
                .then(async () => {
                    props.favoritesStore.getMediaInFavorites(media_type).then(() => {
                        return "ok"
                    })
                    await GetFavoriteFromAsyncStorage(props, media_type)
                })
                .catch(err => console.error("ERROR [props.favoritesStore.addMediaToWatchlist] then catch: ", err))
        })
        .catch(err => console.error("GetMovieWatchList error 2 : ", err))

}
