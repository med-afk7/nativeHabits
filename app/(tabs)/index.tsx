import { client, DATABASE_ID, databases, HABITS_COLLECTION_ID, HABITS_COMPLETIONS_COLLECTION_ID, RealtimeResponse } from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { ID, Query } from "react-native-appwrite";
import { Swipeable } from "react-native-gesture-handler";
import { Button, IconButton, Surface, Text } from "react-native-paper";
import { Habit, HabitCompletion } from "../../types/database.type";

export default function Index() {

  const router = useRouter();

  const {signOut , user} = useAuth();
  const[habits, setHabits] = useState<Habit[]>();
  const[completed, setCompleted] = useState<string[]>([]);
  const swipeableRefs = useRef<{[key:string]:Swipeable |null}>({})

 useEffect(() => {

  if(user){

  const channel = `databases.${DATABASE_ID}.collections.${HABITS_COLLECTION_ID}.documents`;
  const habitsSubscription = client.subscribe(
    channel,
    (response: RealtimeResponse) => {
      if (
        response.events.includes("databases.*.collections.*.documents.*.create")
      ) {
        fetchHabits();
      } else if (
        response.events.includes("databases.*.collections.*.documents.*.update")
      ) {
        fetchHabits();
      }
      else if (
        response.events.includes("databases.*.collections.*.documents.*.delete")
      ) {
        fetchHabits();
      }
    }
  );

    fetchHabits();
    fetchTodayCompletions();

    return () => {
      habitsSubscription();
    }
  }
}, [user]);



   function addRoute () {
    router.replace("/(tabs)/add-habit")
   }

const fetchHabits= async () => {
  if (!user?.$id) return;

  try {
    const response = await databases.listDocuments(DATABASE_ID!,HABITS_COLLECTION_ID! , [Query.equal("user_id", user.$id ?? "")])


    setHabits(response.documents as unknown as Habit[]);
    
  } catch (error) {
    console.error(error);
  }
}



const fetchTodayCompletions= async () => {


  try {
     
    const today = new Date();

    today.setHours(0,0,0,0);


    const response = await databases.listDocuments(DATABASE_ID!,
      HABITS_COMPLETIONS_COLLECTION_ID! ,
       [Query.equal("user_id", user?.$id ?? "")
        ,Query.greaterThanEqual("completed_at", today.toISOString())])

        

        const completions = response.documents as unknown as HabitCompletion[]
    setCompleted(completions.map((c) => c.habit_id));
    
  } catch (error) {
    console.error(error);
  }
}


const handleDeleteHabit =  async (id : string) => {
  try {
    await databases.deleteDocument(DATABASE_ID!,HABITS_COLLECTION_ID!,id)
    
  } catch (error) {
    console.error(error)
  }

}


const handleCompleteHabit =  async (id : string) => {

  if(!user ||completed?.includes(id))return;
  
  const currentDate = new Date().toISOString() ;

  if(!user)return ;
  try {
    await databases.createDocument(DATABASE_ID!,
      HABITS_COMPLETIONS_COLLECTION_ID!,
      ID.unique(),
      {
        habit_id:id,
        user_id:user.$id ,
        completed_at :currentDate
      }
    
    )

    const habit = habits?.find((h) => h.$id === id);
    if(!habit )return ;

    await databases.updateDocument(DATABASE_ID! , HABITS_COLLECTION_ID! , id , {

      streak_count : habit.streak_count+1 , 
      last_completed : currentDate
    })
    
  } catch (error) {
    console.error(error)
  }

}


const renderRightActions = () =>(
  <View style={styles.swipeActionRight}>
    <MaterialCommunityIcons 
    name="check-circle-outline"
     size={32}
      color={"#fff"}/>
  </View>
)

const renderLeftActions = () =>(
  <View style={styles.swipeActionLeft}>
    <MaterialCommunityIcons 
    name="trash-can-outline"
     size={32}
      color={"#fff"}/>
  </View>
)

  return (
    <View
      style={styles.container}
    >
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}> Today's Habits</Text>

      <Button mode="text" onPress={signOut} icon={"logout"}>Sign Out</Button>


      </View>
<ScrollView showsVerticalScrollIndicator={false}>
      {habits?.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No Habits yet . Add habits </Text>
          
        <IconButton onPress={addRoute} icon={"plus"} />
        </View>
      ) : (
        habits?.map((habit, key) =>(

          <Swipeable ref={(ref) => {
            swipeableRefs.current[habit.$id] =ref 
            
          }}
          key={key}
          overshootLeft={false}
          overshootRight={false}
          renderLeftActions={renderLeftActions}
          renderRightActions={renderRightActions}
          onSwipeableOpen={(direction) => {
            if(direction === "left"){
              handleDeleteHabit(habit.$id);
              
            }
            else if (direction === "right"){
              handleCompleteHabit(habit.$id);
 
            }

            swipeableRefs.current[habit.$id]?.close();
          }}
          >
          <Surface style={styles.card} elevation={0} >
          
        <View  style={styles.cardContent}>

        <Text style={styles.cardTitle}>{String(habit.title)}</Text>
        <Text style={styles.cardDescription}>{String(habit.description)}</Text>
        <View style={styles.cardFooter}>
          <View style={styles.streakBadge}> 
            <MaterialCommunityIcons name="fire" size={18} color={"#ff9800"}/>
            <Text style={styles.streakText}>{habit.streak_count} day/s Streak</Text>
            
            </View>
            <View style={styles.frequencyBadge}>

        <Text style={styles.frequencyText}>{habit.frequency.charAt(0).toUpperCase() + habit.frequency.slice(1)}</Text>
        </View>
        </View>
        

        </View> 
        </Surface>
        </Swipeable>
        ))
          
        
      )}
     
 
     </ScrollView>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontWeight: "bold",
  },

  card: {
    marginBottom: 18,
    borderRadius: 18,
    backgroundColor: "#f7f2fa",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 4,
  },

  cardCompleted: {
    opacity: 0.6,
  },
  cardContent: {
    padding: 20,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    color: "#22223b",
  },
  cardDescription: {
    fontSize: 15,
    marginBottom: 16,
    color: "#6c6c80",
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff3e0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakText: {
    marginLeft: 6,
    color: "#ff9800",
    fontWeight: "bold",
    fontSize: 14,
  },
  frequencyBadge: {
    backgroundColor: "#ede7f6",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  frequencyText: {
    color: "#7c4dff",
    fontWeight: "bold",
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyStateText: {
    color: "#666666",
  },
  swipeActionLeft: {
    justifyContent: "center",
    alignItems: "flex-start",
    flex: 1,
    backgroundColor: "#e53935",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingLeft: 16,
  },
  swipeActionRight: {
    justifyContent: "center",
    alignItems: "flex-end",
    flex: 1,
    backgroundColor: "#4caf50",
    borderRadius: 18,
    marginBottom: 18,
    marginTop: 2,
    paddingRight: 16,
  },
});