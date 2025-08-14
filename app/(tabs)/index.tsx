import { DATABASE_ID, databases, HABITS_COLLECTION_ID } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Query } from "react-native-appwrite";
import { Button } from "react-native-paper";
import { Habit } from "../../types/database.type";

export default function Index() {

  const {signOut , user} = useAuth();

  const[habits, setHabits] = useState<Habit[]>();

const fetchHabit = async () => {
  if (!user?.$id) return;
  
  try {
    const response = await databases.listDocuments(DATABASE_ID!,HABITS_COLLECTION_ID! , [Query.equal("user_id", user.$id ?? "")])
    
  } catch (error) {
    console.error(error);
  }
}

  return (
    <View
      style={styles.view}
    >
     
      <Text>My name is ahmed</Text>

      <Button mode="text" onPress={signOut} icon={"logout"}>Sign Out</Button>
     
    </View>
  );
}


const styles = StyleSheet.create({
  view:{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },

    navButton:{
       width:100, height :20, 
        backgroundColor :"blue" , 
        borderRadius:8 , 
        textAlign:"center"

    },


})