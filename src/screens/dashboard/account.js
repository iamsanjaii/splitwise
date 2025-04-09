import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useNavigation } from '@react-navigation/native';

import { UserContext } from '../../services/usercontext';
import male from '../../../assets/images/maleAvatar.png';
import colors from '../../constants/colors'; 

const Account = () => {
  const [userName, setUserName] = useState('');
  const { setIsLoggedIn } = useContext(UserContext);
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserName = async () => {
        const name = await AsyncStorage.getItem('userName');
        if (name) {
          setUserName(name);
        }
      };
      fetchUserName();
    }, [])
  );

  const handleLogout = async () => {
    try {
      await AsyncStorage.clear();
      setUserName('');
      setIsLoggedIn(false);
    } catch (error) {
      console.error('Failed to clear async storage:', error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.container}>
        <Text style={styles.header}>Account</Text>

        <ScrollView style={{ flex: 1, marginTop: 20 }}>
          <View style={styles.personalInfoContainer}>
            <Image source={male} style={styles.avatar} />
            <View style={styles.personalTextContainer}>
              <Text style={styles.nameText}>{userName}</Text>
              <Text style={styles.emailText}>
                {userName.toLowerCase().replace(/\s+/g, '')}@splitwise.com
              </Text>
            </View>
            <TouchableOpacity style={{ marginLeft: 'auto' }}>
              <Feather name="edit-2" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>


          <View style={styles.optionsContainer}>
            <Option icon="grid" label="Scan Code" />
            <Option icon="star" label="Splitwise Pro" iconColor={colors.primary} />
          </View>

          <SectionTitle title="Preferences" />
          <View style={styles.preferencesContainer}>
            <Option icon="mail" label="Email Settings" />
            <Option icon="bell" label="Device and Push Notification Settings" />
            <Option icon="lock" label="Security" />
          </View>


          <SectionTitle title="Feedback" />
          <View style={styles.feedbackContainer}>
            <Option icon="message-circle" label="Rate Splitwise" />
            <Option icon="phone" label="Contact Splitwise Support" />
            <TouchableOpacity style={styles.optionBar} onPress={handleLogout}>
              <Feather name="log-out" size={30} color={colors.placeholder} />
              <Text style={styles.optionText}>Logout</Text>
            </TouchableOpacity>
          </View>


          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Developed by Sanjai</Text>
            <View style={styles.footerRow}>
              <Text style={styles.footerSubText}>Version 1.0</Text>
              <Text style={styles.footerSubText}>Privacy Policy</Text>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const Option = ({ icon, label, iconColor = colors.white }) => (
  <View style={styles.optionBar}>
    <Feather name={icon} size={30} color={iconColor} />
    <Text style={styles.optionText}>{label}</Text>
  </View>
);

const SectionTitle = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

export default Account;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  header: {
    color: colors.white,
    fontSize: 25,
    fontWeight: '600',
    fontFamily: 'Poppins',
  },
  personalInfoContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 50,
  },
  personalTextContainer: {
    marginLeft: 20,
  },
  nameText: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'Poppins',
    color: colors.white,
  },
  emailText: {
    fontSize: 15,
    fontWeight: '400',
    fontFamily: 'Poppins',
    color: colors.placeholder,
  },
  optionsContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    padding: 10,
  },
  preferencesContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    padding: 10,
  },
  feedbackContainer: {
    backgroundColor: colors.inputBackground,
    borderRadius: 10,
    padding: 10,
  },
  optionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionText: {
    color: colors.white,
    fontSize: 20,
    fontFamily: 'Poppins',
    marginLeft: 10,
  },
  sectionTitle: {
    color: colors.white,
    margin: 10,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  footerContainer: {
    padding: 10,
    alignItems: 'center',
  },
  footerText: {
    color: colors.placeholder,
    fontSize: 16,
    fontFamily: 'Poppins',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  footerSubText: {
    color: colors.placeholder,
    fontSize: 10,
    fontFamily: 'Poppins',
    marginLeft: 10,
  },
});
