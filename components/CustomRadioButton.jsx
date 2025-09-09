import React, { useState } from "react";
import { Text, View } from "react-native";
import RadioButtonGroup, { RadioButtonItem } from "expo-radio-button";
function CustomRadioButton({
  firstValue,
  secondValue,
  firstLabel,
  secondLabel,
  onSelected,
  selected,
}) {
  return (
    <View>
      <RadioButtonGroup
        containerStyle={{ flexDirection: "row", marginHorizontal: 20, gap: 10 }}
        selected={selected}
        onSelected={onSelected}
        radioBackground="green"
      >
        <RadioButtonItem value={firstValue} label={firstLabel} />
        <RadioButtonItem value={secondValue} label={secondLabel} />
      </RadioButtonGroup>
    </View>
  );
}
export default CustomRadioButton;
