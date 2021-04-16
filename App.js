import React from 'react';
import { StyleSheet } from 'react-native';
import Constants from "expo-constants";
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Navigation } from "./src/navigation/Navigation";
import { loginStore } from "./src/stores/LoginStore"
import { Provider } from 'mobx-react';
import { watchlistStore } from "./src/stores/WatchlistStore";
import { mediaStore } from "./src/stores/MediasStores";
import { favoritesStore } from "./src/stores/FavoriteStore"

const MyTheme = {
	dark: true,
	colors: {
		primary: '#f07178',
		background: '#292D3E',
		card: '#292D3E',
		text: '#676E95',
		border: '#676E95',
		notification: 'rgb(255, 69, 58)',
	},
};

export default function App() {
	const stores = { loginStore, watchlistStore, mediaStore, favoritesStore }
	return (
		<Provider {...stores}>
			<NavigationContainer theme={MyTheme}>
				<Navigation />
			</NavigationContainer>
		</Provider>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop: Constants.statusBarHeight,
	},
});
