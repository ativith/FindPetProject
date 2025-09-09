import React, { useContext } from "react";
import { supabase } from "../lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { FlatList, Text } from "react-native";
import PostItem from "../components/PostItem";
import { View } from "react-native";
import SearchBar from "../components/SearchBar";
import { useNavigation } from "@react-navigation/native";
import { usePosts } from "../hooks/usePosts";
import { Modal } from "react-native";
import SearchPopUp from "./SearchPopUp";
function FindPetScreen({ navigation }) {
  const [filters, setFilters] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  const { data, refetch, isFetching, isError, error } = usePosts({
    ...filters,
    typeofpost: "findhome",
  });
  if (isError) {
    return (
      <Text>
        {error.message} - {error.code} - {error.details}
      </Text>
    );
  }

  if (isFetching) return <Text>Loading...</Text>;
  function renderItemPost(dataItem) {
    const item = dataItem.item;
    const postProps = {
      id: item.id,
      user_id: item.user_id,
      image_url: item.image_url,
      name: item.name,
      species: item.species,
      color: item.color,
      age: item.age,
      collar: item.collar,
      detail: item.detail,
      highlight: item.highlight,
      lost_date: item.lost_date,
      location: item.location,
      latitude: item.latitude,
      longitude: item.longitude,
      reward: item.reward,
    };
    return <PostItem {...postProps} navigation={navigation} />;
  }
  return (
    <View>
      <SearchBar onPress={() => setModalVisible(true)} />
      <Modal visible={modalVisible} animationType="slide" transparent>
        <SearchPopUp
          onApplyFilters={setFilters}
          onClose={() => setModalVisible(false)}
          initialFilters={filters}
        />
      </Modal>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        refreshing={isFetching}
        onRefresh={refetch}
        renderItem={renderItemPost}
      />
    </View>
  );
}

export default FindPetScreen;
