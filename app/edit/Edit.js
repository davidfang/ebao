import {StyleSheet, View, Text} from 'react-native';
import React, {Component} from 'react';

export default class Edit extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text onPress={this._back.bind(this)}>编辑页面</Text>
            </View>
        );
    }

    _back() {
        const {navigator} = this.props;
        if (navigator) {
            navigator.pop();
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center'
    }
});