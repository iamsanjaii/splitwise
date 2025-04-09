import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import addFriendsIllustration from '../../../assets/images/addFriends.png';
import colors from '../../constants/colors';

const Friends = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <View style={styles.topIcons}>
          <Feather name="search" size={20} color={colors.placeholder} style={styles.iconMargin} />
          <Feather name="user-plus" size={20} color={colors.placeholder} />
        </View>

        <ScrollView
          style={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.scrollContainerChild}>
            <Image
              source={addFriendsIllustration}
              style={styles.illustration}
            />
            <Text style={styles.noFriendsText}>No Friends to Show</Text>

            <TouchableOpacity style={styles.addButton}>
              <Feather name="user-plus" size={20} color={colors.primary} />
              <Text style={styles.addButtonText}>Add more Friends</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default Friends;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  innerContainer: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 30,
    paddingVertical: 20,
    marginTop: 10,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconMargin: {
    marginRight: 20,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 20,
  },
  scrollContainerChild: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  illustration: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  noFriendsText: {
    color: colors.placeholder,
    fontFamily: 'Poppins',
    textAlign: 'center',
    fontSize: 20,
  },
  addButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    alignItems: 'center',
    borderColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
  },
  addButtonText: {
    color: colors.primary,
    fontFamily: 'Poppins',
    fontSize: 20,
  },
});
