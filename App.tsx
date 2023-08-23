import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AllPlaces } from './screens/AllPlaces';
import { AddPlace } from './screens/AddPlace';
import { IconButton } from './components/ui/IconButton';
import { Colors } from './constants/colors';
import { Map } from './screens/Map';
import { useEffect, useState } from 'react';
import { init } from './utils/database';
import * as SplashScreen from 'expo-splash-screen';
import { PlaceDetails } from './screens/PlaceDetails';

SplashScreen.preventAutoHideAsync();

export type AppStackParamList = {
  AddPlaces: undefined | { pickedLng: number; pickedLat: number };
  AllPlaces: undefined;
  Map:
    | {
        initialLat: number;
        initialLng: number;
      }
    | undefined;
  PlaceDetails: { placeId: string };
};

export type PlaceDataType = {
  title: string;
  image: string | undefined;
  location: {
    lat: number | undefined;
    lng: number | undefined;
    address: string | undefined;
  };
  id?: string;
};

const Stack = createNativeStackNavigator<AppStackParamList>();

export default function App() {
  const [dbInitialized, setDbInitialized] = useState<boolean>(false);

  async function hideSplashScreen() {
    await SplashScreen.hideAsync();
  }

  useEffect(() => {
    init()
      .then(() => {
        setDbInitialized(true);
        hideSplashScreen();
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  if (!dbInitialized) {
    return null;
  }
  return (
    <>
      <StatusBar style='dark' />
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerStyle: {
              backgroundColor: Colors.primary500,
            },
            headerTintColor: Colors.gray700,
            contentStyle: { backgroundColor: Colors.gray700 },
          }}
        >
          <Stack.Screen
            name='AllPlaces'
            component={AllPlaces}
            options={({ navigation }) => ({
              title: 'Your Favorite Places',
              headerRight: ({ tintColor }) => (
                <IconButton
                  icon='add'
                  color={tintColor}
                  size={24}
                  onPress={() => navigation.navigate('AddPlaces')}
                />
              ),
            })}
          />
          <Stack.Screen
            name='AddPlaces'
            component={AddPlace}
            options={{ title: 'Add a new Place' }}
          />
          <Stack.Screen name='Map' component={Map} />
          <Stack.Screen
            name='PlaceDetails'
            component={PlaceDetails}
            options={{ title: 'Loading Place...' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
