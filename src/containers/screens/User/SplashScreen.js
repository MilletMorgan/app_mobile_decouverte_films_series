import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

const SplashScreen = () => {
    return (
        <View style={{ flex: 1, backgroundColor: 'steelblue', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>Loading</Text>
            <ActivityIndicator size="large" color="white" />
        </View>
    );
};

export default SplashScreen;