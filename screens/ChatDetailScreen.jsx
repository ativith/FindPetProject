import React from "react";
import {
  Channel,
  MessageList,
  MessageInput,
  useChatContext,
} from "stream-chat-expo";

import { ActivityIndicator, SafeAreaView } from "react-native";
import { useState, useEffect } from "react";
const ChatDetailScreen = ({ route }) => {
  const { client } = useChatContext();
  const channelId = route.params.channelId;
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    const fetchChannel = async () => {
      const channels = await client.queryChannels({ cid: channelId });

      setChannel(channels[0]);
    };
    fetchChannel();
  }, [channelId]);
  if (!channel) {
    return <ActivityIndicator />;
  }
  return (
    <Channel channel={channel}>
      <MessageList />
      <SafeAreaView>
        <MessageInput />
      </SafeAreaView>
    </Channel>
  );
};

export default ChatDetailScreen;
