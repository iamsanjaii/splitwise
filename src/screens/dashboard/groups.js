import React, { useState, useEffect, useCallback } from 'react';
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
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import GroupsImageIllustration from '../../../assets/images/image.png';
import avatar from '../../../assets/images/avatar.png';
import colors from '../../constants/colors';

const Groups = () => {
  const navigation = useNavigation();
  const [userName, setUserName] = useState('');
  const [groups, setGroups] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        const name = await AsyncStorage.getItem('userName');
        const storedGroups = await AsyncStorage.getItem('groups');
        if (name) setUserName(name);
        if (storedGroups) setGroups(JSON.parse(storedGroups));
      };
      fetchData();
    }, [])
  );

  const DefaultInfo = () => (
    <View style={styles.scrollContainerChild}>
      <Image
        source={GroupsImageIllustration}
        style={styles.illustration}
      />
      <Text style={styles.noGroupsText}>No groups yet</Text>
      <TouchableOpacity
        style={styles.createGroupButton}
        onPress={() => navigation.navigate('CreateGroup')}
      >
        <Feather name="user-plus" size={20} color={colors.primary} />
        <Text style={styles.createGroupText}>Start a New Group</Text>
      </TouchableOpacity>
    </View>
  );

  const GroupList = ({ group }) => (
    <TouchableOpacity
      style={styles.groupListContainer}
      onPress={() => navigation.navigate('GroupPage', { group })}
    >
      <Image source={avatar} style={styles.grp_avatar} />
      <View style={{ flex: 1 }}>
        <Text style={styles.grp_name}>{group.name}</Text>
        <Text style={styles.grp_category}>{group.category}</Text>
      </View>
    </TouchableOpacity>
  );

  const AddGroupButton = () => (
    <TouchableOpacity
      style={styles.floatingIconButton}
      onPress={() => navigation.navigate('CreateGroup')}
    >
      <Feather name="user-plus" size={24} color="#000" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topIcons}>
          <Feather name="search" size={20} color={colors.placeholder} style={styles.iconSpacing} />
          <Feather name="user-plus" size={20} color={colors.placeholder} />
        </View>

        <View style={styles.greetingsContainer}>
          <Text style={styles.greetingsText}>
            Welcome to SplitWise, <Text style={styles.userName}>{userName}</Text>
          </Text>
        </View>

        <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
          <Text style={styles.title}>Your Groups</Text>
          {groups.length === 0 ? (
            <DefaultInfo />
          ) : (
            groups.map((group, index) => (
              <GroupList key={index} group={group} />
            ))
          )}
        </ScrollView>

        <AddGroupButton />
      </View>
    </SafeAreaView>
  );
};

export default Groups;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 2,
    marginTop: 10,
  },
  topIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconSpacing: {
    marginRight: 20,
  },
  greetingsContainer: {
    marginTop: 20,
    marginBottom: 20,
  },
  greetingsText: {
    fontSize: 20,
    fontFamily: 'Poppins',
    color: colors.white,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    fontFamily: 'Poppins',
    color: colors.white,
  },
  scrollContainer: {
    flex: 1,
    marginTop: 10,
  },
  scrollContainerChild: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  illustration: {
    width: 250,
    height: 250,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  noGroupsText: {
    color: colors.placeholder,
    fontFamily: 'Poppins',
    fontSize: 20,
    textAlign: 'center',
  },
  createGroupButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors.primary,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    marginTop: 20,
    gap: 10,
  },
  createGroupText: {
    color: colors.primary,
    fontFamily: 'Poppins',
    fontSize: 20,
  },
  groupListContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#212332',
    gap: 10,
    marginBottom: 10,
    width: '100%',
  },
  grp_avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  grp_name: {
    fontSize: 20,
    fontFamily: 'Poppins',
    color: colors.white,
  },
  grp_category: {
    fontSize: 15,
    fontFamily: 'Poppins',
    color: colors.placeholder,
  },
  floatingIconButton: {
    position: 'absolute',
    bottom: 60,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
