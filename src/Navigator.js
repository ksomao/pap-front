import MapScreen from "./screens/MapScreen";
import LoginScreen from "./screens/LoginScreen";
import {
  createStackNavigator,
  createAppContainer
} from "react-navigation";

const AppNavigator = createStackNavigator({
    Map: MapScreen,
    Login: LoginScreen
  },
  {
    initialRouteName: "Login"
  });

export default createAppContainer(AppNavigator);
