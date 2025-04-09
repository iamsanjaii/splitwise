import React, { useEffect, useState, useCallback } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { PieChart } from 'react-native-chart-kit';
import Svg, { G, Circle, Text as SvgText, TSpan } from 'react-native-svg';

import avatar from '../../assets/images/avatar.png';

const GroupPage = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { group } = route.params;

  const [groupExpenses, setGroupExpenses] = useState([]);
  const [breakdown, setBreakdown] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [total, setTotal] = useState(0);

  const colorPalette = ['#4DE68C', '#38B76C', '#63EDA1', '#B1F5D1', '#3ECB75', '#2DB45F'];

  const fetchExpenses = async () => {
    try {
      const allExpenses = await AsyncStorage.getItem('expenses');
      if (allExpenses) {
        const parsedExpenses = JSON.parse(allExpenses);
        const groupExpenses = parsedExpenses.filter((exp) => exp.groupId === group.id);
        setGroupExpenses(groupExpenses);

        const createdByName = group.createdBy || 'You';
        const members = [createdByName, ...(group.friends || [])];
        const memberSummary = {};
        const categorySummary = {};
        let totalAmount = 0;

        members.forEach((member) => {
          memberSummary[member] = 0;
        });

        groupExpenses.forEach((exp) => {
          const perPerson = exp.amount / members.length;
          members.forEach((member) => {
            memberSummary[member] += perPerson;
          });

          categorySummary[exp.category] = (categorySummary[exp.category] || 0) + exp.amount;
          totalAmount += exp.amount;
        });

        setBreakdown(
          Object.entries(memberSummary).map(([name, amount], index) => ({
            name,
            amount,
            color: colorPalette[index % colorPalette.length],
            legendFontColor: '#fff',
            legendFontSize: 14,
          }))
        );

        setCategoryBreakdown(
          Object.entries(categorySummary).map(([category, amount], index) => ({
            name: category,
            amount,
            color: colorPalette[index % colorPalette.length],
            legendFontColor: '#fff',
            legendFontSize: 14,
          }))
        );

        setTotal(totalAmount);
      } else {
        setGroupExpenses([]);
        setBreakdown([]);
        setCategoryBreakdown([]);
        setTotal(0);
      }
    } catch (err) {
      console.error('Error loading expenses:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchExpenses();
    }, [])
  );

  const handleDeleteGroup = async () => {
    try {
      const stored = await AsyncStorage.getItem('groups');
      const groups = stored ? JSON.parse(stored) : [];
      const updatedGroups = groups.filter((g) => g.id !== group.id);
      await AsyncStorage.setItem('groups', JSON.stringify(updatedGroups));

      const storedExpenses = await AsyncStorage.getItem('expenses');
      const expenses = storedExpenses ? JSON.parse(storedExpenses) : [];
      const updatedExpenses = expenses.filter((e) => e.groupId !== group.id);
      await AsyncStorage.setItem('expenses', JSON.stringify(updatedExpenses));

      Alert.alert('Group deleted');
      navigation.goBack();
    } catch (error) {
      console.error('Failed to delete group:', error);
    }
  };

  const handleMoreOptions = () => {
    Alert.alert(
      'Group Options',
      'What would you like to do?',
      [
        { text: 'Delete Group', onPress: handleDeleteGroup, style: 'destructive' },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: true }
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#151729' }}>
      <View style={styles.topBannerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={30} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleMoreOptions}>
          <Feather name="more-horizontal" size={30} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.groupInfoContainer}>
          <Image source={avatar} style={styles.groupLogo} />
          <View style={styles.groupTextContainer}>
            <Text style={styles.groupTitle}>{group.name}</Text>
            <Text style={styles.groupDate}>
              Created at{' '}
              {new Date(group.createdAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
              })}
            </Text>
          </View>
          <TouchableOpacity style={{ marginLeft: 'auto' }}>
            <Feather name="edit-2" size={20} color="#4DE68C" />
          </TouchableOpacity>
        </View>

        <Text style={styles.memberTitle}>Members</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 15, paddingLeft: 20 }}>
          {group.friends?.length > 0 ? (
            group.friends.map((friend, index) => (
              <View key={index} style={styles.memberCard}>
                <Image source={avatar} style={styles.memberAvatar} />
                <Text style={styles.memberName}>{friend}</Text>
              </View>
            ))
          ) : (
            <Text style={{ color: '#7c808D', fontFamily: 'Poppins' }}>No members yet</Text>
          )}
        </ScrollView>

        <View style={styles.optionsContainer}>
          <TouchableOpacity style={styles.optionBar}>
            <Text style={styles.optionText}>Settle Up</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.optionBar}>
            <Text style={styles.optionText}>Charts</Text>
          </TouchableOpacity>
        </View>

        {groupExpenses.length > 0 ? (
          <>
            <View style={{ alignItems: 'center', marginTop: 10 }}>
              <Text style={{ color: '#fff', fontFamily: 'Poppins', fontSize: 18, marginBottom: 10 }}>
                Category-wise Expenses
              </Text>
              <PieChart
                data={categoryBreakdown}
                width={Dimensions.get('window').width - 40}
                height={220}
                chartConfig={{
                  color: () => '#fff',
                }}
                accessor="amount"
                backgroundColor="transparent"
                paddingLeft="15"
                center={[10, 0]}
                absolute
              />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 20, paddingHorizontal: 10 }}>
              <Svg width={220} height={220}>
                <G rotation="-90" origin="100, 100">
                  {(() => {
                    let offset = 0;
                    return breakdown.map((item, index) => {
                      const strokeLength = (item.amount / total) * 2 * Math.PI * 90;
                      const circle = (
                        <Circle
                          key={index}
                          cx={100}
                          cy={100}
                          r={80}
                          stroke={item.color}
                          strokeWidth={14}
                          strokeDasharray={`${strokeLength} ${2 * Math.PI * 90}`}
                          strokeDashoffset={-offset}
                          strokeLinecap="round"
                          fill="transparent"
                        />
                      );
                      offset += strokeLength;
                      return circle;
                    });
                  })()}
                </G>
                <SvgText
                  x={100}
                  y={100}
                  fill="#fff"
                  fontSize={16}
                  fontWeight="bold"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  fontFamily="Poppins"
                >
                  <TSpan x={100} dy="-10">Total</TSpan>
                  <TSpan x={100} dy="20">₹ {total}</TSpan>
                </SvgText>
              </Svg>

              <View style={{ marginLeft: 20 }}>
                <Text style={{ color: '#fff', fontSize: 16, fontFamily: 'Poppins', marginBottom: 10 }}>Breakdown</Text>
                {breakdown.map((e, idx) => (
                  <View key={idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <View style={{ width: 12, height: 12, backgroundColor: e.color, borderRadius: 6, marginRight: 10 }} />
                    <Text style={{ color: '#fff', fontFamily: 'Poppins' }}>{e.name}: ₹{e.amount.toFixed(0)}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        ) : (
          <View style={{ alignItems: 'center', marginTop: 40 }}>
            <Text style={{ color: '#7c808D', fontSize: 16, fontFamily: 'Poppins' }}>
              No Expenses Yet
            </Text>
            <Text style={{ color: '#7c808D', fontSize: 16, fontFamily: 'Poppins' }}>
              Add some expenses to see the breakdown.
            </Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingIconButton}
        onPress={() => navigation.navigate('AddExpense', {
          group,
          onGoBack: fetchExpenses,
        })}
      >
        <Feather name="dollar-sign" size={20} color="#000" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default GroupPage;

const styles = StyleSheet.create({
  topBannerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  groupInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#1F2134',
    borderRadius: 10,
    padding: 20,
    margin: 10,
    marginTop: 20,
  },
  groupLogo: {
    width: 70,
    height: 70,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#4DE68C',
  },
  groupTitle: {
    color: '#fff',
    fontSize: 25,
    fontFamily: 'Poppins',
    fontWeight: 'bold',
  },
  groupTextContainer: {
    marginLeft: 15,
    justifyContent: 'center',
  },
  groupDate: {
    color: '#7c808D',
    fontSize: 14,
    fontFamily: 'Poppins',
  },
  memberTitle: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins',
    marginLeft: 20,
  },
  memberCard: {
    alignItems: 'center',
    marginRight: 20,
  },
  memberAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: '#4DE68C',
  },
  memberName: {
    color: '#fff',
    fontSize: 14,
    fontFamily: 'Poppins',
    marginTop: 5,
  },
  optionsContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 10,
    margin: 10,
  },
  optionBar: {
    flexDirection: 'row',
    backgroundColor: '#212332',
    borderRadius: 10,
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  optionText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: 'Poppins',
  },
  floatingIconButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4DE68C',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
});
