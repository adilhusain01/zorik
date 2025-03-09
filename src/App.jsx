import { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./contexts/AuthContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import Loader from "./components/Loader";
import QuizView from "./components/QuizView";

// Lazy load components
const Home = lazy(() => import("./components/Home"));
const MindMap = lazy(() => import("./components/MindMap"));
const UserProfile = lazy(() => import("./components/UserProfile"));

export default function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Router>
          <div className="bg-background text-foreground">
            <Navbar />
            <div className="mt-[6rem]">
              <Suspense fallback={<Loader />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/mindmap" element={<MindMap />} />
                  <Route path="/profile" element={<UserProfile />} />
                  <Route path="/quiz/:topic/:nodeText" element={<QuizView />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </Router>
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}
