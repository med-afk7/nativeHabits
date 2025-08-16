import { useAuth } from "@/lib/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen(){
    const [isSignUp , SetIsSignUp] = useState<boolean>(false);
    const [email , setEmail] = useState <string> ("");
    const [password , setPassword] =  useState<string>("");
    const [error , setError] = useState<string | null>("");
    const theme = useTheme();
    const {signIn, signUp} = useAuth();
    const router = useRouter();

    const handleAuth = async () =>{
        if(!email&&!password){
            setError("Please fill in the form")
            return;
        }
        else if (!email ||!password){
            setError(!email? "Email missing " : "Password missing ");
            return;
        }


        if(password.length<6){
            setError("Passwords must be atleast 6 characters long.")
            return;
        }
        

setError(null);

if(isSignUp){
  const error =   await signUp(email , password)
  if(error) {
    setError(error)
    return;
}

}else{
   const error =  await signIn(email, password)
     if(error) {
    setError(error)
    return;
}

router.replace("/");
}

    }

    const handleSwitchMode = () =>{
        SetIsSignUp((prev) => !prev);
    }

    return (

<KeyboardAvoidingView 
behavior={Platform.OS ==="ios" ? "padding" : "height"}
style={styles.container}
>
    <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">{isSignUp ? "Create Account" : "welcome back"}</Text>

        <TextInput label="Email"
         autoCapitalize="none" 
         keyboardType="email-address" 
         placeholder="example@gmail.com"
         mode="outlined"
         style={styles.input}
         onChangeText={setEmail}
         />

             <TextInput label="Password"
         autoCapitalize="none" 
       secureTextEntry={true}
         mode="outlined"
          style={styles.input}
          onChangeText={setPassword}
         />

{error && (
    <Text style={{color:theme.colors.error}}>{String(error)}</Text>
)}

<Button mode="contained"  style={styles.button} onPress={handleAuth}>{isSignUp?"Sign Up" :"Login"}</Button>

<Button mode="text" onPress={handleSwitchMode}
 style={styles.switchModeButton}
>
    {isSignUp?"Already have an account ? Sign in" :"Don't have an account Sign up!"}</Button>
    </View>

</KeyboardAvoidingView>


    )

}

const styles = StyleSheet.create({

    container:{
        flex:1 , 
        backgroundColor:"#f5f5f5" , 
    },

    content:{
        flex:1,
        padding:16,
        justifyContent: "center",

    },
    title :{
        textAlign:"center",
        marginBottom:24 , 


    }
    ,
    input:{
        
       marginBottom: 16,
  backgroundColor: "white" , 
    }
,
    button:{
      marginTop:8 ,
    } 
    ,
    switchModeButton:{
        marginTop:16,
    }



})