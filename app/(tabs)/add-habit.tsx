import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Button, SegmentedButtons, TextInput } from "react-native-paper";

const FREQUENCIES =["daily" , "weekly" , "monthly"]
type Frequency = (typeof FREQUENCIES) [number];


export default function AddHabitScreen(){

const [title , setTitle] = useState<string>("");
const [description , setDescription] = useState<string>("");
const [frequency , setFrequency] = useState<Frequency>("daily");


    return(

    <View style={styles.container}>
       
      <TextInput label="title" mode="outlined" style={styles.input} contentStyle={{ borderRadius:8}} onChangeText={setTitle}/>
      <TextInput label="description" mode="outlined" style={styles.input} contentStyle={{ borderRadius:8}} onChangeText={setDescription}/>


              <View style={styles.frequencyContainer}>
        <SegmentedButtons
        value={frequency}
        onValueChange={(value) => setFrequency(value as Frequency)}
 
          buttons={FREQUENCIES.map((freq) => ({
            value: freq,
            label: freq.charAt(0).toUpperCase() + freq.slice(1),
          }))}
          
        />
      </View>
      <Button mode="contained" 
       disabled={!title || !description}
      >Add Habit</Button>

        </View>
)
}


const styles = StyleSheet.create({
     container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
  },

  input: {
  marginBottom: 16,
  backgroundColor: "white", // important for cutout visibility


       
  },

  frequencyContainer: {
    marginBottom: 24,
  },
});