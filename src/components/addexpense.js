import React, { useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';

import COLORS, { breakdownColors } from '../constants/colors';

const InputField = ({ icon, placeholder, value, onChangeText }) => (
  <View style={styles.inputContainer}>
    <View style={styles.iconWrapper}>
      <Feather name={icon} size={30} color={COLORS.primary} />
    </View>
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={COLORS.placeholder}
        value={value}
        onChangeText={onChangeText}
        keyboardType={icon === 'dollar-sign' ? 'numeric' : 'default'}
      />
    </View>
  </View>
);

const AddExpense = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { group, onGoBack } = route.params;

  const [category, setCategory] = useState('');
  const [amount, setAmount] = useState('');

  const handleAddExpense = async () => {
    if (!category || !amount) {
      Alert.alert('Please fill all the fields!');
      return;
    }

    try {
      const splitMembers = group?.friends || [];
      const splitAmount = parseFloat(amount) / splitMembers.length;

      const newExpense = {
        id: Date.now(),
        groupId: group.id,
        groupName: group.name,
        category,
        amount: parseFloat(amount),
        paidBy: 'You',
        splitBetween: splitMembers,
        date: new Date().toISOString(),
        breakdown: splitMembers.map((name, index) => ({
          name,
          amount: parseFloat(splitAmount.toFixed(2)),
          color: breakdownColors[index % breakdownColors.length],
        })),
      };

      const stored = await AsyncStorage.getItem('expenses');
      const expenses = stored ? JSON.parse(stored) : [];
      const updatedExpenses = [newExpense, ...expenses];

      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      if (onGoBack && typeof onGoBack === 'function') {
        onGoBack();
      }

      navigation.goBack();
    } catch (error) {
      console.error('Failed to save expense:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="x" size={30} color={COLORS.white} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Add Expense</Text>
        <TouchableOpacity onPress={handleAddExpense}>
          <Feather name="check" size={30} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      <View style={styles.main}>
        <Text style={styles.withText}>
          With You and: All of{' '}
          <Text style={styles.highlightText}>{group.name}</Text>
        </Text>

        <View style={styles.fieldContainer}>
          <InputField
            icon="file-text"
            placeholder="Enter a category"
            value={category}
            onChangeText={setCategory}
          />
          <InputField
            icon="dollar-sign"
            placeholder="Enter amount"
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        <View style={styles.categorySection}>
          <Text style={styles.infoText}>
            Paid by{' '}
            <Text style={styles.boldHighlight}>You</Text> and Split{' '}
            <Text style={styles.boldHighlight}>Equally</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
  },
  headerText: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: '500',
    fontFamily: 'Poppins',
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
  },
  withText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: 'Poppins',
  },
  highlightText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  fieldContainer: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  iconWrapper: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    borderRadius: 10,
    padding: 20,
  },
  inputWrapper: {
    flex: 1,
    marginLeft: 20,
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
  categorySection: {
    marginTop: 20,
  },
  infoText: {
    color: COLORS.white,
    fontSize: 20,
    fontFamily: 'Poppins',
    marginTop: 10,
    textAlign: 'center',
  },
  boldHighlight: {
    color: COLORS.primary,
    fontSize: 20,
    fontWeight: 'bold',
  },
});
