import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import COLORS from '../constants/colors';

const FriendInput = ({ friends, setFriends }) => {
  const [input, setInput] = useState('');

  const handleAddFriend = () => {
    if (input.trim() !== '') {
      setFriends([...friends, input.trim()]);
      setInput('');
    }
  };

  const removeFriend = (indexToRemove) => {
    setFriends(friends.filter((_, index) => index !== indexToRemove));
  };

  return (
    <View>
      <View style={styles.inputContainer}>
        <View style={styles.iconBox}>
          <Feather name="users" size={30} color={COLORS.primary} />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.label}>Add Friends</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Friend's Name"
            placeholderTextColor={COLORS.placeholder}
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleAddFriend}
            returnKeyType="done"
          />
        </View>
      </View>

      {friends.length > 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 10 }}
        >
          {friends.map((friend, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => removeFriend(index)}
              style={styles.friendBox}
            >
              <Text style={styles.friendText}>{friend} ✕</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default FriendInput;

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  iconBox: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 10,
    padding: 20,
  },
  textContainer: {
    flex: 1,
    marginLeft: 20,
  },
  label: {
    color: COLORS.white,
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  input: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    padding: 10,
    color: COLORS.white,
    borderBottomColor: COLORS.primary,
    borderBottomWidth: 1,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  friendBox: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  friendText: {
    color: COLORS.background,
    fontSize: 14,
    fontFamily: 'Poppins',
  },
});
