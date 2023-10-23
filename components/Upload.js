import React, { useState } from 'react';
import { ImageBackground, Text, View, Button, Image, StyleSheet} from 'react-native';

const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    uploadcontainer: {
        borderWidth: 1,
        marginTop:'6%',
        borderStyle: 'solid',
        borderColor: '#dbd8ce',
        borderRadius: 5,
        width:400, 
        height:600,
        alignItems:'center',
        justifyContent:'center',
    },
    uploadborder: {
        display:'flex',
        width:100,
        height:100,
    }
}

export default function UploadItem() {
    return (
        <View style={styles.container}>
            <View style={styles.uploadcontainer}>
                <Image style={styles.uploadborder} source={require('./assets/Upload_Icon.png')}/>
            </View>
        </View>
    );
}