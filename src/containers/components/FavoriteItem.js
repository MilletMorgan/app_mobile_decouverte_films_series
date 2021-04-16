import React, { useEffect, useState } from "react";
import { GetMediaImage } from "../../api/TheMovieDBApi";
import { RemoveFavoriteFromTmdb } from "../../features/RemoveFavoriteFromTmdb";
import { ImageBackground, Text, TouchableOpacity, View } from "react-native";
import { watchlistStyles } from "../../styles/watchlistStyles";
import { mainStyles } from "../../styles/mainStyles";
import Ionicons from 'react-native-vector-icons/Ionicons';


export const FavoriteItem = ({ favorite, props, media_type }) => {
    const [poster, setPoster] = useState('#')

    useEffect(() => {
        GetMediaImage('w500', favorite.poster_path)
            .then(r => setPoster(r))
            .catch(e => console.error(e))
    }, [])

    return (
        <View >
            <TouchableOpacity onPress={() => {
                if (media_type === 'tv')
                    props.navigation.navigate('GetTvByIdScreen', { id: favorite.id, props: props })
                else
                    props.navigation.navigate('GetMovieByIdScreen', { id: favorite.id, props: props })
            }}>
                <View style={{ height: 150, width: 150 }}>
                    <View style={{ flex: 1 }}>
                        <ImageBackground
                            resizeMode="contain"
                            style={{ flex: 1, justifyContent: "space-between" }}
                            source={{ uri: poster }}
                        >
                            <TouchableOpacity style={{ alignSelf: "flex-end", paddingRight: 30 }}
                                onPress={() => {
                                    RemoveFavoriteFromTmdb(props, media_type, favorite.id)
                                }}>
                                <Ionicons name='ios-star' size={25} color='yellow' />

                            </TouchableOpacity>
                            <Text style={[mainStyles.mediaTitle, { textAlign: "center", backgroundColor: '#34324a', opacity: 0.8 }]}>{favorite.name || favorite.title}</Text>

                        </ImageBackground>
                    </View>


                </View>
            </TouchableOpacity>
        </View>
    )
}
