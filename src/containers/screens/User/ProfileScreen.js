import React, { useEffect, useState } from 'react'
import { View, Text, StyleSheet, Image } from 'react-native'
import { GetUserAccount } from "../../../api/TheMovieDBApi";
import { inject, observer, Provider } from 'mobx-react';
import { loginStore } from "../../../stores/LoginStore"
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler';
import SplashScreen from "./SplashScreen"
import { FavoriteItem } from '../../components/FavoriteItem';
import { GetFavoriteList } from "../../../api/TheMovieDBApi";
import { GetFavoriteFromAsyncStorage } from "../../../features/GetFavoriteFromAsyncStorage";
import { AddFavoriteFromTmdb } from "../../../features/AddFavoriteFromTmdb";





export const ProfileScreen = ({ navigation }) => {
    const stores = { loginStore }

    return (
        <Provider {...stores}>
            <Profile navigation={navigation}></Profile>
        </Provider>
    )


}
const ProfileHandling = (props) => {
    const { loginStore } = props;
    const [user, setUser] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = React.useState(null);

    let openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            alert("Permission to access camera roll is required!");
            return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync();

        if (pickerResult.cancelled === true) {
            return;
        }
        setSelectedImage({ localUri: pickerResult.uri });
        AsyncStorage.setItem('avatar', JSON.stringify(pickerResult.uri))
    }

    const renderFavoriteMovieItem = ({ item }) =>
        <FavoriteItem favorite={item}
            props={props}
            media_type="movie"
        />

    const renderFavoriteTVItem = ({ item }) =>
        <FavoriteItem favorite={item}
            props={props}
            media_type="tv"
        />




    useEffect(() => {
        GetUserAccount(loginStore.user.session_id).then(r => { setUser(r.data), setIsLoading(false) }).catch(err => console.log(err))

        const _retrieveData = async () => {
            try {
                const value = await AsyncStorage.getItem('avatar');
                if (value !== null)
                    setSelectedImage({ localUri: JSON.parse(value) })
            } catch (error) {
                console.error(error);
            }

        };
        _retrieveData()

        AddFavoriteFromTmdb(props, 'tv')
        AddFavoriteFromTmdb(props, 'movie')
    }, [])


    return (
        !isLoading ? <View style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            <View style={styles.container}>
                <View style={styles.credentialContainer}>
                    <Text style={styles.input}  >{user.username + ' ' + user.iso_3166_1} </Text>
                    <TouchableOpacity onPress={() => openImagePickerAsync()}>
                        {selectedImage !== null ? <Image
                            source={{ uri: selectedImage.localUri }}
                            style={styles.thumbnail}
                        /> :
                            <Image
                                source={{ uri: `https://www.gravatar.com/avatar/${user.avatar.gravatar.hash}` }}
                                style={styles.thumbnail}
                            />
                        }</TouchableOpacity>
                </View>
            </View>
            <View style={{ flex: 2 }}>
                {props.favoritesStore.favorites.favoritesMovie.length > 0 ?
                    <View>
                        <Text style={styles.favoriteTitle}>Vos Films Favoris</Text>
                        <FlatList
                            style={{ backgroundColor: '#34324a' }}
                            contentContainerStyle={{ alignItems: "center", padding: 10 }}
                            horizontal={true}
                            data={props.favoritesStore.favorites.favoritesMovie}
                            extraData={props.favoritesStore.favorites.favoritesMovie}
                            renderItem={renderFavoriteMovieItem}
                            keyExtractor={item => item.id.toString()}
                        />
                    </View> : <Text style={styles.favoriteTitle}>You have no favorite movies</Text>}
                {props.favoritesStore.favorites.favoritesTv.length > 0 ? <View>
                    <Text style={styles.favoriteTitle}>Vos Séries Favorites</Text>
                    <FlatList
                        style={{ backgroundColor: '#34324a' }}
                        contentContainerStyle={{ alignItems: "center", padding: 10 }}
                        horizontal={true}
                        data={props.favoritesStore.favorites.favoritesTv}
                        extraData={props.favoritesStore.favorites.favoritesTv}
                        renderItem={renderFavoriteTVItem}
                        keyExtractor={item => item.id.toString()}
                    /></View> : <Text style={styles.favoriteTitle}>You have no favorite tv shows</Text>}
            </View>
        </View> :
            <SplashScreen />
    )
}
const Profile = inject('loginStore', 'favoritesStore')(observer(ProfileHandling))
const styles = StyleSheet.create({
    favoriteTitle: {
        fontWeight: 'bold',
        textAlign: "center",
        color: '#FFF',
        padding: 5
    },
    thumbnail: {
        width: 200,
        height: 100,
        resizeMode: "contain"
    },
    container: {
        display: 'flex',
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#292D3E"
    },
    credentialContainer: {
        display: 'flex',
        alignItems: "center",
        justifyContent: "center",
        height: 175,
        width: 175,
        borderRadius: 10,
        backgroundColor: "#A6ACCD"
    },
    input: {
        fontWeight: 'bold',
        margin: 5,
        fontSize: 18,
        color: '#ab47bc',
        textAlign: "center",
        width: '100%'
    },
    button: {
        backgroundColor: 'indigo',
        marginTop: 20
    },
    buttonText: {
        color: "white",
        padding: 10
    }
});