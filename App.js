import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import SubjectScreen from './SubjectScreen';
import { NavigationContainer } from '@react-navigation/native';
import AboutScreen from './AboutScreen';
import ContactScreen from './contactScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Subject" component={SubjectScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
        <Stack.Screen name="Contact" component={ContactScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
