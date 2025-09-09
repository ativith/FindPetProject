import React, { useState, useEffect } from "react";
import { Alert, StyleSheet, View, AppState } from "react-native";
import { supabase } from "../lib/supabase";
import Input from "./Input";
import Button from "./Button";

export default function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Manage AppState for auto-refresh tokenr
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        supabase.auth.startAutoRefresh();
      } else {
        supabase.auth.stopAutoRefresh();
      }
    });

    // Cleanup on unmount
    return () => {
      subscription.remove();
      supabase.auth.stopAutoRefresh();
    };
  }, []);

  async function signInWithEmail() {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    }
    setLoading(false);
  }

  async function signUpWithEmail() {
    setLoading(true);
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else if (!session) {
      Alert.alert("Success", "Please check your inbox for email verification!");
    }
    setLoading(false);
  }
  /*function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case "email":
        setEmail(enteredValue);
        break;

      case "password":
        setPassword(enteredValue);
        break;
    }
  }*/

  return (
    <View style={styles.container}>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Input
          label="Email"
          updateValue={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"

          // autoCapitalize="none"
          // keyboardType="email-address"
        />
      </View>
      <View style={styles.verticallySpaced}>
        <Input
          label="Password"
          updateValue={(text) => setPassword(text)}
          value={password}
          //secureTextEntry
          placeholder="Password"
          // autoCapitalize="none"
          type="password"
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={signInWithEmail} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
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
