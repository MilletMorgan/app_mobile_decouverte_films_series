export const GetFavoriteFromAsyncStorage = (props, media_type) => {
    return props.favoritesStore.getMediaInFavorites(media_type)
        .then()
        .catch(err => console.error("ERROR [GetFavoriteFromAsyncStorage] catch: ", err))
}