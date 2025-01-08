import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, Image, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';


const { width } = Dimensions.get('window');

const LevelScreenV2 = () => {
  const [coins, setCoins] = useState(Array.from({ length: 10 }, (_, i) => i + 1));
  const [isLoading, setIsLoading] = useState(false);


  const loadMoreCoins = () => {
    if (isLoading) return;


    setIsLoading(true);
    setTimeout(() => {
      const newCoins = Array.from({ length: 10 }, (_, i) => coins.length + i + 1);
      setCoins((prevCoins) => [...prevCoins, ...newCoins]);
      setIsLoading(false);
    }, 1500);
  };


  const renderItem = ({ item, index }) => (
    <View style={styles.coinContainer}>
      <Image source={require('../../assets/images/coin.png')} style={styles.coinImage} />
      <Text style={styles.coinText}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text>⭐ 3</Text>
        <Text>❤️ 10</Text>
        <Text>💰 1500</Text>
      </View>
      <FlatList
        data={coins}
        renderItem={renderItem}
        keyExtractor={(item) => item.toString()}
        onEndReached={loadMoreCoins}
        onEndReachedThreshold={0.5}
        numColumns={1}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          isLoading && (
            <View style={styles.activityIndicator}>
              <ActivityIndicator size="large" color="white" />
            </View>
          )
        }
      />
      <View style={styles.readyButton}>
        <Text style={styles.readyText}>Ready</Text>
      </View>
    </View>
  );
};

export default LevelScreenV2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0073e6', // Blue background
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
    fontSize: 18,
    color: '#fff',
  },
  listContent: {
    paddingBottom: 100, // Space for the button at the bottom
  },
  coinContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  coinImage: {
    width: 70,
    height: 70,
    resizeMode: 'contain',
  },
  coinText: {
    position: 'absolute',
    top: 9,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  readyButton: {
    position: 'absolute',
    bottom: 20,
    left: width * 0.3,
    right: width * 0.3,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  readyText: {
    fontSize: 20,
    color: '#0073e6',
  },
  activityIndicator: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
