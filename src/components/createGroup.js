import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import FriendInput from './friendsInput';
import COLORS from '../constants/colors'; 

const CreateGroup = () => {
  const navigation = useNavigation();
  const [groupName, setGroupName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [friends, setFriends] = useState([]);

  const addActivity = async (info, groupName, time) => {
    try {
      const stored = await AsyncStorage.getItem('activities');
      const activities = stored ? JSON.parse(stored) : [];

      const newActivity = {
        info,
        groupName,
        time,
      };

      activities.unshift(newActivity);
      await AsyncStorage.setItem('activities', JSON.stringify(activities));
    } catch (error) {
      console.log('Error saving activity:', error);
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim()) {
      alert('Please enter a group name');
      return;
    }

    if (!selectedCategory) {
      alert('Please select a category');
      return;
    }

    try {
      const storedGroups = await AsyncStorage.getItem('groups');
      const groups = storedGroups ? JSON.parse(storedGroups) : [];

      const newGroup = {
        id: Date.now().toString(),
        name: groupName.trim(),
        category: selectedCategory,
        friends,
        createdAt: new Date().toISOString(),
      };

      await AsyncStorage.setItem('groups', JSON.stringify([...groups, newGroup]));
      await addActivity(
        'You created a group',
        groupName.trim(),
        new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      );

      Alert.alert('Group Created', `Group "${groupName}" created successfully!`);
      setGroupName('');
      setSelectedCategory('');
      setFriends([]);
      navigation.navigate('Main');
    } catch (err) {
      console.error(err);
      alert('Error saving group');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.topHeaderContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={30} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Create a Group</Text>
        <TouchableOpacity onPress={handleCreateGroup}>
          <Feather name="check" size={30} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.mainContainer}>
        <View style={styles.groupFieldContainer}>
          <View style={styles.ImageContainer}>
            <Feather name="camera" size={30} color={COLORS.primary} />
          </View>
          <View style={styles.groupInputContainer}>
            <Text style={styles.label}>Group Name</Text>
            <TextInput
              style={styles.groupInput}
              placeholder="Enter group name"
              placeholderTextColor={COLORS.placeholder}
              value={groupName}
              onChangeText={setGroupName}
            />
          </View>
        </View>

        <FriendInput friends={friends} setFriends={setFriends} />

        <View style={styles.categoryContainer}>
          <Text style={styles.label}>Type</Text>
          <View style={styles.categoryOptions}>
            {['Travel', 'Home', 'Couple', 'Other'].map((type, index) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.categoryOptionBtn,
                  selectedCategory === type && { borderColor: COLORS.primary },
                ]}
                onPress={() => setSelectedCategory(type)}
              >
                <Feather
                  name={
                    type === 'Travel' ? 'navigation' :
                    type === 'Home' ? 'home' :
                    type === 'Couple' ? 'heart' : 'box'
                  }
                  size={24}
                  color={COLORS.primary}
                />
                <Text style={styles.categoryText}>{type}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Text style={styles.bottomNote}>
          Splitwise will remind friends to join, add expenses, and settle up.
        </Text>
      </View>
    </SafeAreaView>
  );
};

export default CreateGroup;

const styles = StyleSheet.create({
  topHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  headerText: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  mainContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  groupFieldContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  ImageContainer: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 10,
    padding: 20,
  },
  groupInputContainer: {
    flex: 1,
    marginLeft: 20,
  },
  groupInput: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    padding: 10,
    color: COLORS.white,
    borderBottomColor: COLORS.primary,
    borderBottomWidth: 1,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  label: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  categoryContainer: {
    marginTop: 20,
  },
  categoryOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryOptionBtn: {
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderWidth: 2,
    borderColor: COLORS.inputBackground,
    borderRadius: 10,
    padding: 10,
    width: 75,
  },
  categoryText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  bottomNote: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: 'Poppins',
    marginTop: 20,
  },
});
