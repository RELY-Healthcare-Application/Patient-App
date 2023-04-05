//import liraries
import React, { useEffect, useState } from "react";
import { 
  ActivityIndicator,
  View,
  StyleSheet,
  FlatList
} from "react-native";
import { Button, List, Text, IconButton, MD3Colors} from "react-native-paper";
import routes from "../../navigation/routes";
import { getPrevConsultDetails } from "../../service/ConsultationService";
import { downloadDocument } from "../../service/DocumentService";

// create a component
const ConsultationDetailsScreen = ({ navigation, route }) => {
  const [isLoading, setLoading] = useState(true);
  const [data, setData] = useState([]);
  const { consultation } = route.params;
  const consultId = 5;

  const getPreviousConsultationDetails = async (consultId) => {
    try{
      const json = await getPrevConsultDetails(consultId);
      console.log("Json msg");
      console.log(json);
      setData(json);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  
    const dateObj = new Date(consultation.startTime);

    const options = {
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    dateStyle: 'short', 
    };
    
    const dateString = dateObj.toLocaleString('en-US', options);
    
    const d = dateString.split(/[' ']/);
    const weekday = d[0];
    const monthname = d[1];
    const year = d[4];
    const t = d[3].split(/[':']/);
    const time = t[0]+":"+t[1];
    const day = dateObj.getDate();
    const ordinalIndicator = getOrdinalIndicator(day);
    const formattedDay = `${day}${ordinalIndicator}`;
    
    const formattedDate1 = `${formattedDay}-${monthname}`;
    const formattedDate2 = `${formattedDate1}-${year}-${time}`;
    
    
    function getOrdinalIndicator(day) {
      const j = day % 10, k = day % 100;
      if (j == 1 && k != 11) {
          return "st";
      }
      if (j == 2 && k != 12) {
          return "nd";
      }
      if (j == 3 && k != 13) {
          return "rd";
      }
      return "th";
    }
  

  useEffect(() =>{
    getPreviousConsultationDetails(consultId);
  }, []);

  return (
    <View>
      {isLoading? (
        <ActivityIndicator style={styles.indicator}/>
      ) : (
            <>
            <Text  style={styles.text}>Dr.{consultation.doctorName}</Text>
            <Text  style={styles.subtext}>{consultation.specialization}{'\t\t\t\t'}{formattedDate2}</Text>
            
            
            {/* console.log(consultation.start_time); */}
            <FlatList
            data={data}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <View style={styles.box}>
                <List.Item
                  titleStyle={{ color: "black" }}
                  title={`${item.name}`}
                  right={props => <IconButton
                    icon="download"
                    iconColor={MD3Colors.secondary10}
                    size={20}
                    onPress={() => downloadDocument(item.id)}
                  />} />
              </View>
            )} /></>
      )}
    </View>
  );
};

// define your styles
const styles = StyleSheet.create({
  indicator : {
    size: "big",
    height:"50%",
    position:"absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    flex: 2,
    //padding: 24,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "white",
    flexDirection: "column",
  },
  box: {
    height: 70,
    width: "100%",
    padding: 1,
    margin: 1,
    borderRadius: 20,
    backgroundColor: "#F5ECFF",
  },
  text: {
    color:"black",
    marginTop:30,
    marginLeft:30,
    fontSize:30,
  },
  subtext: {
    color:"black",
    marginLeft:30,
    fontSize:18,
  },
});

//make this component available to the app
export default ConsultationDetailsScreen;
