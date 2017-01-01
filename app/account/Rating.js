import {View, Text, Image, TouchableOpacity, TouchableHighlight, StyleSheet, Dimensions} from 'react-native';
import React, {Component} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Button from 'react-native-button';
import StarRating from 'react-native-star-rating';

export default class Rating extends Component {
    constructor(props) {
        super(props);
        this.state = {
            starCount: 4
        };
    }

    render() {
        return (
            <View style={styles.container}>
                <View style={[styles.header, styles.border_bottom]}>
                    <TouchableOpacity style={styles.header_back_box} onPress={this._goBack.bind(this)}>
                        <Icon style={styles.back_icon} name="ios-arrow-back"/>
                        <Text style={styles.back_text}>返回</Text>
                    </TouchableOpacity>
                    <Text style={styles.header_title}>评价</Text>
                </View>
                <View style={styles.body}>
                    <View style={styles.item}>
                        <View style={styles.item_info}>
                            <TouchableHighlight underlayColor="#fff">
                                <Image style={styles.item_image} source={require('../../assets/images/creation/list_item.jpg')}/>
                            </TouchableHighlight>
                            <View style={styles.item_part}>
                                <View style={styles.info_item_space}>
                                    <Text style={styles.item_desc_text} numberOfLines={2}>
                                        苹果MacBook Pro 13.3英寸笔记本电脑 深空灰色(Core i5处理器/256G SSD闪存)
                                    </Text>
                                </View>
                                <Text style={styles.item_part_number}>参与1人次</Text>
                            </View>
                        </View>
                        <View style={styles.item_check}>
                            <Text style={styles.item_check_text}>共1件宝贝,合计16元(含运费6元)</Text>
                        </View>
                    </View>
                    <View style={[styles.item_time, styles.border_bottom, styles.backgound_white]}>
                        <Text style={styles.item_time_text}>成交时间: 2016-11-11 11:11:11</Text>
                    </View>
                    <View style={[styles.item_rating_box, styles.border_bottom, styles.backgound_white]}>
                        <View style={styles.item_rating}>
                            <Text style={styles.rating_text}>评价</Text>
                            <StarRating disabled={false} maxStars={5} rating={this.state.starCount} emptyStarColor={'#999'}
                                        starColor={'#ee735c'} selectedStar={(rating) => this._onStarRatingPress(rating)}/>
                        </View>
                        <Button style={styles.rating_button} onPress={this._rating.bind(this)}>
                            确认
                        </Button>
                    </View>
                </View>
            </View>
        );
    }

    _goBack() {
        const {navigator} = this.props;

        if (navigator) {
            navigator.pop();
        }
    }

    _onStarRatingPress(rating) {
        this.setState({
            starCount: rating
        });
    }

    _rating() {

    }
}

const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    margin_top: {
        marginTop: 10
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
    header: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: width,
        height: 64,
        paddingTop: 20,
        paddingLeft: 10,
        paddingRight: 10,
        backgroundColor: '#fff'
    },
    header_back_box: {
        position: 'absolute',
        left: 12,
        top: 32,
        width: 50,
        flexDirection: 'row',
        alignItems: 'center'
    },
    header_title: {
        width: width - 120,
        textAlign: 'center',
        fontSize: 16
    },
    back_icon: {
        color: '#999',
        fontSize: 20,
        marginRight: 5
    },
    back_text: {
        color: '#999',
        fontSize: 16,
    },
    body: {
        flex: 1,
        backgroundColor: '#ddd'
    },
    item_separator: {
        height: 1,
        backgroundColor: '#000',
    },
    item: {
        padding: 10,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#000'
    },
    item_info: {
        flexDirection: 'row',
    },
    item_image: {
        width: 150,
        height: 73
    },
    item_part: {
        flex: 1
    },
    info_item_space: {
        flex: 1
    },
    item_desc_text: {
        flex: 1,
        fontSize: 16
    },
    item_text: {
        color: '#666',
        fontSize: 16,
    },
    item_part_number: {
        color: '#666',
        fontSize: 16
    },
    item_check: {
        alignSelf: 'flex-end',
        marginTop: 10,
    },
    item_check_text: {
        fontSize: 16
    },
    item_time: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    item_time_text: {
        fontSize: 16
    },
    item_rating_box: {
        paddingTop: 10
    },
    item_rating: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rating_text: {
        fontSize: 18,
        paddingLeft: 10,
        paddingRight: 10
    },
    rating_button: {
        width: width - 20,
        padding: 10,
        marginTop: 20,
        marginBottom: 20,
        marginLeft: 10,
        borderWidth: 1,
        borderColor: '#ee735c',
        borderRadius: 4,
        color: '#ee735c',
        fontSize: 18
    }
});