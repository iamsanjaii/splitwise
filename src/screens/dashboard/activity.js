import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Image,
  StyleSheet,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import avatar from "../../../assets/images/avatar.png";
import colors from "../../constants/colors";

const Activity = () => {
  const [activities, setActivities] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchActivities = async () => {
        try {
          const stored = await AsyncStorage.getItem("expenses");
          const expenses = stored ? JSON.parse(stored) : [];

          const formatted = expenses.map((exp) => {
            const date = new Date(exp.date);
            const time = date.toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            });

            return {
              id: exp.id,
              info: "You added an expense to",
              groupName: exp.groupName || exp.groupId,
              time: time,
            };
          });

          setActivities(formatted);
        } catch (error) {
          console.error("Failed to load activities:", error);
        }
      };

      fetchActivities();
    }, [])
  );

  const ActivityInfo = ({ info, groupName, time }) => (
    <View style={styles.activityContainer}>
      <Image source={avatar} style={styles.activityImage} />
      <View style={styles.textWrapper}>
        <Text style={styles.activityText}>{info} '{groupName}'</Text>
        <Text style={styles.activityTime}>Today at {time}</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.heading}>Activity</Text>

        <View style={styles.content}>
          {activities.length === 0 ? (
            <Text style={styles.noActivity}>No activity yet</Text>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flex: 1, width: "100%" }}
            >
              {activities.map((item) => (
                <ActivityInfo
                  key={item.id}
                  info={item.info}
                  groupName={item.groupName}
                  time={item.time}
                />
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Activity;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  heading: {
    color: colors.white,
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "Poppins",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  noActivity: {
    color: colors.placeholder,
    fontSize: 16,
    fontFamily: "Poppins",
    marginTop: 20,
  },
  activityContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginTop: 10,
  },
  textWrapper: {
    flex: 1,
    marginLeft: 10,
  },
  activityText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: "Poppins",
  },
  activityTime: {
    color: colors.placeholder,
    fontSize: 14,
    fontFamily: "Poppins",
  },
  activityImage: {
    width: 60,
    height: 60,
    resizeMode: "contain",
  },
});
