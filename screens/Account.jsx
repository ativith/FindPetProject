import React, { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import { StyleSheet, View, Alert } from "react-native";
import Input from "../components/Input";
import Button from "../components/Button";
import Avatar from "../components/Avatar";
import { FlatList } from "react-native";
import { useAuth } from "../provider/AuthProvider";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
export default function Account() {
  const { session } = useAuth();

  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (session) getProfile();
  }, [session]);

  async function getProfile() {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const { data, error, status } = await supabase
        .from("profiles")
        .select("username, phone_number, avatar_url,last_name,address")
        .eq("id", session?.user.id)
        .single();

      if (error && status !== 406) {
        throw error;
      }

      if (data) {
        setUsername(data.username);
        setPhone(data.phone_number);
        setAvatarUrl(data.avatar_url);
        setLastName(data.last_name);
        setAddress(data.address);
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  async function updateProfile({
    username,
    phone_number,
    avatar_url,
    last_name,
    address,
  }) {
    try {
      setLoading(true);
      if (!session?.user) throw new Error("No user on the session!");

      const updates = {
        id: session?.user.id,
        username,
        last_name,
        phone_number,
        address,
        avatar_url,
        updated_at: new Date(),
      };

      const { error } = await supabase.from("profiles").upsert(updates); //ส่งค่าไปยัง supabase

      if (error) {
        throw error;
      }
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert(error.message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAwareScrollView style={styles.container}>
      <View>
        <Avatar
          size={150}
          url={avatarUrl}
          onUpload={(url) => {
            setAvatarUrl(url);
            updateProfile({
              avatar_url: url,
            });
          }}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Username"
          value={username || ""}
          updateValue={(text) => setUsername(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Last Name"
          value={lastName || ""}
          updateValue={(text) => setLastName(text)}
        />
      </View>
      <View style={[styles.verticallySpaced]}>
        <Input label="Email" value={session?.user?.email} disabled={true} />
      </View>

      <View style={styles.verticallySpaced}>
        <Input
          label="Phone number"
          value={phone || ""}
          updateValue={(text) => setPhone(text)}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Address"
          value={address || ""}
          updateValue={(text) => setAddress(text)}
        />
      </View>

      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button
          title={loading ? "Loading ..." : "Update"}
          onPress={() =>
            updateProfile({
              username,
              last_name: lastName,
              avatar_url: avatarUrl,
              address: address,
              phone_number: phone,
            })
          }
          disabled={loading}
          color="black"
        />
      </View>

      <View style={styles.verticallySpaced}>
        <Button
          title="Sign Out"
          onPress={async () => await supabase.auth.signOut()}
          color="red"
        />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
