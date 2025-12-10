import { Tabs } from "expo-router";
import React from "react";
import TabBar from "@/components/TabBar";
import { GlobalStyles } from "@/constants/theme";

export default function TabLayout() {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            display: 'none',
          },
        }}
      >
        {/* основные экраны */}
        <Tabs.Screen name="index" />
        <Tabs.Screen name="map" />
        <Tabs.Screen name="urgent" />
        <Tabs.Screen name="questionnaire" />
        <Tabs.Screen name="questionnaireHistory" />
        <Tabs.Screen name="search" />
        <Tabs.Screen name="forums" />
        
        {/* Детали чата - в корне app */}
      </Tabs>
      
      <TabBar />
    </>
  );
}