import React, { useEffect, useState } from 'react'
import { Text, View, Image, ScrollView } from 'react-native'
import { GetPersonById, GetMediaImage } from "../../../api/TheMovieDBApi";
import { mainStyles } from "../../../styles/mainStyles";

export const GetPersonByIdScreen = ({ route }) => {
	const { id } = route.params;

	const [ person, setPerson ] = useState({
		birthday: "1946-07-06",
		deathday: null,
		gender: 2,
		known_for_department: "Acting",
		name: "Sylvester Stallone",
		place_of_birth: "New York City, New York, USA",
		popularity: 10.743,
		profile_path: "/qDRGPAcQoW8Wuig9bvoLpHwf1gU.jpg",
		biography: ""
	})

	const [ posterUri, setPosterUri ] = useState('#')

	useEffect(() => {
		GetPersonById(id).then(r => {
			setPerson({
				...person,
				['birthday']: r.birthday,
				['deathday']: r.deathday,
				['gender']: r.gender,
				['known_for_department']: r.known_for_department,
				['name']: r.name,
				['place_of_birth']: r.place_of_birth,
				['popularity']: r.popularity,
				['profile_path']: r.profile_path,
				['biography']: r.biography
			})

			GetMediaImage('w500', r.profile_path).then(r => setPosterUri(r))
				.catch(e => console.error(e))
		}).catch(e => console.error(e))
	}, [])

	return (
		<ScrollView style={ mainStyles.card }>
			<Text style={ mainStyles.personName }>
				{ person.name }
			</Text>

			<View style={ mainStyles.mediaInfo }>
				<View style={ mainStyles.posterContainerCard }>
					<Image
						resizeMode="contain"
						style={ [ mainStyles.mediaPoster, { borderRadius: 5 } ] }
						source={ { uri: posterUri } }
					/>
				</View>

				<View style={ mainStyles.mediaInfoList }>
					<Text style={ mainStyles.mediaDescription }>
						Genre : { person.gender === 1 ? "Femme" : person.gender === 2 ? "Homme" : "null" }
					</Text>
					<Text style={ mainStyles.mediaDescription }>
						Né le { person.birthday } à { person.place_of_birth }
					</Text>
					<Text style={ mainStyles.mediaDescription }>
						Date de décès : { person.deathday ? person.deathday : "-" }
					</Text>
					<Text style={ mainStyles.mediaDescription }>
						Metier : { person.known_for_department }
					</Text>
					<Text style={ mainStyles.mediaDescription }>Popularité : { person.popularity }</Text>
				</View>
			</View>

			<View style={ { flex: 1 } }>
				<Text style={ mainStyles.mediaOverview }>{ person.biography }</Text>
			</View>
		</ScrollView>

	)
}
