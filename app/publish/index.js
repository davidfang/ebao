import {View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, NativeModules} from 'react-native';
import React, {Component} from 'react';
import Button from 'react-native-button';
import CameraRollPicker from 'react-native-camera-roll-picker';

export default class Publish extends Component {
    constructor(props) {
        super(props);
        this.state = {
            num: 0,
            selected: [],
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <Text style={styles.header_title}>发布</Text>
                </View>
                <View style={styles.body}>
                    <View style={[styles.border_bottom, styles.backgound_white, styles.padding_left_and_right]}>
                        <TextInput style={styles.title_input} placeholder="标题(品类/品牌/型号等)"/>
                    </View>
                    <View style={[styles.border_bottom, styles.backgound_white, styles.padding_left_and_right]}>
                        <TextInput style={styles.desc_input} multiline={true} placeholder="描述下你的宝贝..."/>
                    </View>
                    <View style={[styles.photos, styles.border_bottom, styles.backgound_white,
                        styles.padding_left_and_right]}>
                        <TouchableOpacity style={styles.photos_box} underlayColor="#fff" onPress={this._selectPhotos.bind(this)}>
                            <Text style={styles.photos_text}>添加图片</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={[styles.price, styles.margin_top, styles.border_top, styles.border_bottom,
                        styles.backgound_white, styles.padding_left_and_right]}>
                        <Text style={styles.price_text1}>售价</Text>
                        <Text style={styles.price_text2}>选择</Text>
                    </View>
                    <Button style={styles.publish_button} onPress={this._publish.bind(this)}>
                         立即发布
                    </Button>
                </View>
            </View>
        );
    }

    _selectPhotos() {
        let me = this;
    }

    _publish() {

    }
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    border_top: {
        borderTopWidth: 1,
        borderTopColor: '#000'
    },
    border_bottom: {
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    padding_left_and_right: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    backgound_white: {
        backgroundColor: '#fff'
    },
    margin_top: {
        marginTop: 15,
    },
    header: {
        paddingTop: 25,
        paddingBottom: 12,
        width: width
    },
    header_title: {
        textAlign: 'center',
        fontSize: 18,
        fontWeight: '600'
    },
    body: {
        flex: 1,
        backgroundColor: '#ddd'
    },
    title_input: {
        height: 50
    },
    desc_input: {
        width: width - 20,
        height: 100,
        paddingTop: 10,
        paddingBottom: 10,
        fontSize: 16
    },
    photos: {
        paddingTop: 10,
        paddingBottom: 10
    },
    photos_box: {
        width: 80,
        height: 80,
        backgroundColor: '#ee735c',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5
    },
    photos_text: {
        fontSize: 16,
        color: '#fff'
    },
    price: {
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    price_text1: {
        fontSize: 16
    },
    price_text2: {
        fontSize: 16,
        color: '#666'
    },
    publish_button: {
        width: width - 20,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 4,
        color: '#ee735c',
        fontSize: 18,
        backgroundColor: '#ffffff',
        overflow:'hidden'
    }
});