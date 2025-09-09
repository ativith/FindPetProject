import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import CustomDropdown from "../components/CustomDropDown";
import CustomCheckbox from "../components/CustomCheckbox";
import Button from "../components/Button";
import { petOptions, colorOptions } from "../variable/option";
import CustomRadioButton from "../components/CustomRadioButton";
import { useNavigation } from "@react-navigation/native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
function SearchPopUp({ onApplyFilters, onClose, initialFilters }) {
  const [petType, setPetType] = useState(initialFilters?.petType || "");
  const [species, setSpecies] = useState(initialFilters?.species || "");
  const [speciesOptions, setSpeciesOptions] = useState([]);
  const [sexSelected, setSexSelected] = useState(initialFilters?.sex || "");
  const [collar, setCollar] = useState(initialFilters?.collar || "");
  const [selectedColors, setSelectedColors] = useState(
    initialFilters?.color || []
  );

  useEffect(() => {
    if (petType) {
      setSpeciesOptions(
        petOptions[petType].breeds.map((sp) => ({
          label: sp.label,
          value: sp.value,
        }))
      );
      // ถ้า species ของ initialFilters มีอยู่แล้วไม่ต้อง reset
      if (!initialFilters?.species) setSpecies(null);
    }
  }, [petType]);
  async function submitInfo() {
    const filters = {
      petType,
      species,
      sex: sexSelected,
      collar,
      color: selectedColors.length ? selectedColors : undefined,
    };

    onApplyFilters(filters);

    onClose();
  }
  return (
    <View style={styles.overlay}>
      <View style={styles.modalBox}>
        <Pressable onPress={onClose} style={{ alignSelf: "flex-end" }}>
          <MaterialIcons name="cancel" size={24} color="black" />
        </Pressable>
        <Text style={{ fontSize: 18, fontWeight: "bold" }}>ค้นหา</Text>

        <Text>ประเภทของสัตว์</Text>
        <CustomDropdown
          value={petType}
          setValue={setPetType}
          items={Object.keys(petOptions).map((pet) => ({
            label: petOptions[pet].label,
            value: pet,
          }))}
          zIndex={2000}
        />

        <Text>สายพันธุ์</Text>
        <CustomDropdown
          value={species}
          setValue={setSpecies}
          items={speciesOptions}
          zIndex={1500}
        />
        <Text>เพศ</Text>

        <CustomRadioButton
          selected={sexSelected}
          firstLabel="ชาย"
          firstValue="male"
          secondLabel="หญิง"
          secondValue="female"
          onSelected={setSexSelected}
        />
        <Text>ปลอกคอ</Text>
        <CustomRadioButton
          selected={collar}
          firstLabel="มี"
          firstValue="havecollar"
          secondLabel="ไม่มี"
          secondValue="nothavecollar"
          onSelected={setCollar}
        />
        <Text>สีของสัตว์</Text>
        <View style={styles.colorContainer}>
          {colorOptions.map((color) => (
            <CustomCheckbox
              key={color.key} // ใช้ color.key เป็น key
              label={color.label} // แสดงสีไทย
              value={color.key} // เก็บค่าเป็น key ภาษาอังกฤษ
              selectedValues={selectedColors}
              setSelectedValues={setSelectedColors}
            />
          ))}
        </View>
        <View style={{ alignSelf: "flex-end" }}>
          <Text>{petType}</Text>
          <Button title="submit" onPress={submitInfo} />
        </View>
      </View>
    </View>
  );
}

export default SearchPopUp;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    height: "70%",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 5,
  },
  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",

    flexWrap: "wrap",
  },
});
/* {haveCollar.map((c) => (
          <CustomCheckbox
            key={c.value} // ใช้ color.key เป็น key
            label={c.label} // แสดงสีไทย
            value={c.value} // เก็บค่าเป็น key ภาษาอังกฤษ
            selectedValues={collar}
            setSelectedValues={setCollar}
          />
))}*/
