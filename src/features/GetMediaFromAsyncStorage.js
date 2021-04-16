export const GetMediaFromAsyncStorage = (props, media_type) => {
	return props.watchlistStore.getMediaInWatchlist(media_type)
		.then()
		.catch(err => console.error("ERROR [GetMediaFromAsyncStorage] catch: ", err))
}
