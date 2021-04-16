import {
    RemoveMediaToFavoriteList,
} from "../api/TheMovieDBApi";
import { AddFavoriteFromTmdb } from "./AddFavoriteFromTmdb";

export const RemoveFavoriteFromTmdb = async (props, media_type, media_id) => {
    await RemoveMediaToFavoriteList(props.loginStore.user.session_id, media_type, media_id)
        .then(() => {
            AddFavoriteFromTmdb(props, media_type).then(() => {})
        })
        .catch(err => console.error("RemoveFavoriteFromTmdb error 1 : ", err))


}
