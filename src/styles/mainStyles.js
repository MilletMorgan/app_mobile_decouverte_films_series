import { StyleSheet } from "react-native";

export const mainStyles = StyleSheet.create({
	card: {
		flex: 1,
		margin: 5,
		backgroundColor: '#34324a',
		borderRadius: 5,
	},

	cardDetail: {
		flex: 1,
		backgroundColor: '#34324a',
		borderRadius: 5,
	},

	noTrailer: {
		backgroundColor: '#000',
		flex: 0,
	},

	noTrailerText: {
		color: '#FFF',
		fontWeight: 'bold',
		fontSize: 30,
		textAlign: 'center'
	},

	pageTitle: {
		fontSize: 26,
		fontWeight: 'bold',
		textAlign: 'center',
	},

	mediaInfo: {
		flexDirection: 'row',
		height: 200,

		flex: 1,

		justifyContent: 'flex-start'
	},

	mediaInfoDetail: {
		flexDirection: 'row',
		justifyContent: 'flex-start',
		marginLeft: 5,
		marginRight: 5,
	},

	posterContainerDetail: {
		flex: 0.4,
		marginLeft: -5,
	},

	posterContainerCard: {
		flex: 0.4,
	},

	mediaPoster: {
		borderTopLeftRadius: 5,
		height: 200,
		width: 'auto',
	},

	mediaInfoList: {
		flex: 0.6,
		padding: 5,
	},

	mediaInfoText: {
		fontStyle: 'italic',
		fontSize: 12,
		color: '#A6ACCD',
	},


	mediaTitle: {
		fontWeight: 'bold',
		color: '#FFF',
		textAlign: 'center',
		fontSize: 16,
		marginBottom: 5,
	},

	mediaImg: {
		flex: 1,
		margin: 100,
		marginRight: 20
	},

	mediaReleaseDate: {
		fontStyle: 'italic',
		fontSize: 12,
		color: '#A6ACCD',
	},

	mediaOverview: {
		color: '#A6ACCD',
		textAlign: 'justify',
	},

	mediaGenre: {
		color: '#FFF',
		fontSize: 10,
		textAlign: 'center'
	},

	genresFlatlist: {
		marginTop: 5,
	},

	contentContainer: {
		flex: 0.1
	},

	mediaVote: {
		fontSize: 12,
		color: '#FFF',
	},

	mediaDescription: {
		fontSize: 12,
		color: '#FFF',
	},

	mediaItem: {
		flex: 1
	},

	genres: {
		backgroundColor: '#202331',
		borderRadius: 20,
		paddingTop: 5,
		paddingBottom: 5,
		paddingLeft: 10,
		paddingRight: 10,
		marginRight: 5,
		marginTop: 2,
	},

	searchBar: {
		flexDirection: 'row',
		backgroundColor: '#ececec',
		borderWidth: 1,
		borderColor: 'lightgrey',
		marginLeft: 5,
		marginRight: 5,
		borderRadius: 5,
	},

	personName: {
		fontWeight: 'bold',
		fontSize: 24,
		textAlign: 'center',
		paddingTop: 5,
		color: '#FFF',
	},

	favorite: {
		position: 'absolute',
		right: 5,
		top: 5
	}
});
