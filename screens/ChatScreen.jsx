import { useState } from "react";
import { Text, StyleSheet } from "react-native";
import {
  ChannelList,
  Channel,
  MessageList,
  MessageInput,
} from "stream-chat-expo";
import { useAuth } from "../provider/AuthProvider";
function ChatScreen({ navigation }) {
  const { user } = useAuth();
  return (
    <ChannelList
      style={styles.container}
      filters={{ members: { $in: [user?.id] } }}
      onSelect={(ch) => {
        navigation.navigate("ChatDetail", { channelId: ch.cid });
      }}
    />
  );
}
export default ChatScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
