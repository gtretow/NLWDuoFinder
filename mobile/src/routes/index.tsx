import { NavigationContainer } from "@react-navigation/native";

import { AppRoutes } from "./app.routes";

export function RoutesContainer() {
  return (
    <NavigationContainer>
      <AppRoutes />
    </NavigationContainer>
  );
}
