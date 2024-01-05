import { MantineProvider } from "@mantine/core";
import "@mantine/core/styles.css";
import { Notifications } from "@mantine/notifications";
import '@mantine/notifications/styles.css';
import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";
import SeatRender from "./SeatRender";
import { AuthProvider } from "./authContext";
import { RequireAuth } from "./components/RequireAuth";
import Dashboard from "./layout/dashboard";
import Authentication from "./pages/AuthPage";
import { theme } from "./theme";



export default function App() {
  return (
    <MantineProvider theme={theme}>
      <Notifications />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Authentication />} />
            <Route path="/" element={
              <RequireAuth>
                <Dashboard />
              </RequireAuth>}>
              <Route path="/seatSelection" element={<SeatRender />} />
            </Route>
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </MantineProvider >
  );
}
