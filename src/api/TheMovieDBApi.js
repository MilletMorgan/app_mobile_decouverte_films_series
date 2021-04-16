import axios from 'axios'
import config from "../config/config";

const api = axios.create({ baseURL: config.API_ROOT_URL })

//Authentication

const GetRequestToken = async () => {
	return await api.get(`/authentication/token/new?api_key=${config.API_KEY}`)
}

const GetUserAccount = async (sessionId) => {
	return await api.get(`/account?api_key=${config.API_KEY}&session_id=${sessionId}`)
}

const ValidateAuthentication = async (reqToken, username, password) => {
	return await api.post(`/authentication/token/validate_with_login?api_key=${config.API_KEY}`, {
		request_token: reqToken,
		username: username,
		password: password
	})
}

const CreateNewSession = async (reqToken) => {
	return await api.post(`/authentication/session/new?api_key=${config.API_KEY}`, {
		request_token: reqToken
	})
}

// Watchlist

const GetWatchlist = async (session_id, media_type) => {
	let newMediaType = media_type

	if (media_type === 'movie')
		newMediaType = 'movies'

	return await api.get(`/account/{account_id}/watchlist/${newMediaType}?api_key=${config.API_KEY}&language=${config.LANGUAGE}&session_id=${session_id}&sort_by=created_at.asc&page=1`)
}

const AddMediaToWatchlist = async (session_id, media_type, media_id) => {

	return await api.post(`/account/{account_id}/watchlist?api_key=${config.API_KEY}&session_id=${session_id}`, {
		"media_type": media_type,
		"media_id": media_id,
		"watchlist": true
	})
}

const RemoveMediaToWatchlist = async (session_id, media_type, media_id) => {
	return await api.post(`/account/{account_id}/watchlist?api_key=${config.API_KEY}&session_id=${session_id}`, {
		"media_type": media_type,
		"media_id": media_id,
		"watchlist": false
	})
		.then((response) => {
			return response
		})
		.catch(error => console.error("RemoveMediaToWatchlist ERROR : ", error))
}

// Favorite
const GetFavoriteList = async (session_id, media_type) => {
	let newMediaType = media_type

	if (media_type === 'movie')
		newMediaType = 'movies'
	return await api.get(`/account/{account_id}/favorite/${newMediaType}?api_key=${config.API_KEY}&session_id=${session_id}&sort_by=created_at.asc&page=1`)
}

const AddMediaToFavoriteList = async (session_id, media_type, media_id) => {

	return await api.post(`/account/{account_id}/favorite?api_key=${config.API_KEY}&session_id=${session_id}`, {
		"media_type": media_type,
		"media_id": media_id,
		"favorite": true
	})
}

const RemoveMediaToFavoriteList = async (session_id, media_type, media_id) => {
	return await api.post(`/account/{account_id}/favorite?api_key=${config.API_KEY}&session_id=${session_id}`, {
		"media_type": media_type,
		"media_id": media_id,
		"favorite": false
	})
		.then(() => {})
		.catch(error => console.error("RemoveMediaToFavoriteList ERROR : ", error))
}

//Rating
const GetRatingList = async (session_id, media_type) => {
	let newMediaType = media_type

	if (media_type === 'movie')
		newMediaType = 'movies'
	return await api.get(`/account/{account_id}/rated/${newMediaType}?api_key=${config.API_KEY}&session_id=${session_id}&sort_by=created_at.asc&page=1`)
}

const rateMedia = async (session_id, media_type, media_id, rating) => {
	return await api.post(`/${media_type}/${media_id}/rating?api_key=${config.API_KEY}&session_id=${session_id}`, {
		"value": rating
	})
}

const deleteRating = async () => {
	return await api.delete(`/${media_type}/${media_id}/rating?api_key=${config.API_KEY}&session_id=${session_id}`)
}

// Search
const SearchMedia = async (search) => {
	try {
		return await api.get(`/search/multi?api_key=${config.API_KEY}&language=${config.LANGUAGE}&query=${search}&page=1&include_adulte=false`)
			.then(r => {
				let results = r.data.results

				results.splice(10)

				return results
			}).catch(e => console.error("SearchMedia error : ", e))
	} catch (e) {
		console.error("SearchMedia try CATCH error :", e)
	}
}

// Media
const GetMediaImage = async (size, path) => {
	return `${config.API_IMAGE_URL}/${size}/${path}`
}

const GetMediaVideo = async (media_id, media_type) => {
	try {
		return await api.get(`/${media_type}/${media_id}/videos?api_key=${config.API_KEY}&language=${config.LANGUAGE}`)
			.then(r => {
				return r.data.results
			}).catch(e => console.error("GetMediaVideo error : ", e))
	} catch (e) {
		console.error("GetMediaVideo try CATCH error :", e)
	}
}

const GetMovieCreditById = async (id) => {
	const filterArray = (array, fields, value) => {
		fields = Array.isArray(fields) ? fields : [fields]

		return array.filter((item) => fields.some((field) => item[field] === value))
	}

	try {
		return await api.get(`/movie/${id}/credits?api_key=${config.API_KEY}&language=${config.LANGUAGE}`)
			.then(r => {
				let cast = r.data.cast
				let crew = r.data.crew

				let director = filterArray(crew, 'job', 'Director')

				cast.splice(3)

				return [cast, director[0]]
			}).catch(e => console.error("GetMovie error : ", e))
	} catch (e) {
		console.error("try CATCH error :", e)
	}
}

const GetTvCreditById = async (id) => {
	const filterArray = (array, fields, value) => {
		fields = Array.isArray(fields) ? fields : [fields]

		return array.filter((item) => fields.some((field) => item[field] === value))
	}

	try {
		return await api.get(`/tv/${id}/credits?api_key=${config.API_KEY}&language=${config.LANGUAGE}`)
			.then(r => {


				let cast = r.data.cast
				let crew = r.data.crew

				let director = filterArray(crew, 'job', 'Director')

				cast.splice(3)

				return [cast, director[0]]
			}).catch(e => console.error("GetMovie error : ", e))
	} catch (e) {
		console.error("try CATCH error :", e)
	}
}

const GetMovieById = async (id) => {
	try {
		return await api.get(`/movie/${id}?api_key=${config.API_KEY}&language=${config.LANGUAGE}`)
			.then(r => {
				return r.data
			}).catch(e => console.error("GetMovie error : ", e))
	} catch (e) {
		console.error("try CATCH error :", e)
	}
}

const GetTvById = async (id) => {
	try {
		return await api.get(`/tv/${id}?api_key=${config.API_KEY}&language=${config.LANGUAGE}`)
			.then(r => {
				return r.data
			}).catch(e => console.error("GetMovie error : ", e))
	} catch (e) {
		console.error("try CATCH error :", e)
	}
}

const GetPersonById = async (id) => {
	try {
		return await api.get(`/person/${id}?api_key=${config.API_KEY}&language=${config.LANGUAGE}`)
			.then(r => {
				return r.data
			}).catch(e => console.error("GetMovie error : ", e))
	} catch (e) {
		console.error("try CATCH error :", e)
	}
}

const GetPopularMovies = async () => {
	return await api.get(`/movie/popular?api_key=${config.API_KEY}&language=${config.LANGUAGE}`)
		.then(r => {
			let popular = r.data.results

			popular.splice(10)

			return popular
		}).catch(e => {
			return e
		})
}

const GetPopularTv = async () => {
	try {
		return await api.get(`/tv/popular?api_key=${config.API_KEY}&language=${config.LANGUAGE}`)
			.then(r => {
				let popular = r.data.results

				popular.splice(10)

				return popular
			}).catch(e => console.error("Get popular TV error : ", e))
	} catch (e) {
		console.error("try CATCH error :", e)
	}
}

export {
	GetMovieById,
	GetMediaImage,
	GetMovieCreditById,
	GetPopularMovies,
	GetPopularTv,
	GetTvById,
	GetTvCreditById,
	GetRequestToken,
	GetUserAccount,
	ValidateAuthentication,
	CreateNewSession,
	GetWatchlist,
	AddMediaToWatchlist,
	RemoveMediaToWatchlist,
	GetFavoriteList,
	AddMediaToFavoriteList,
	RemoveMediaToFavoriteList,
	SearchMedia,
	GetPersonById,
	GetMediaVideo,
	GetRatingList,
	rateMedia,
	deleteRating
}
