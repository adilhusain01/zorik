"use client";

import { useState, useEffect } from "react";
import {
  User,
  Activity,
  Clock,
  Calendar,
  Award,
  BookOpen,
  BarChart,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Loader from "./Loader";
import { useAuth } from "../contexts/AuthContext";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [activityData, setActivityData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [loading, setLoading] = useState(true);
  const { user, login } = useAuth();

  useEffect(() => {
    if (user) {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/user/profile/${user.googleId}`
        );
        const data = await response.json();

        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    const fetchActivityData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URI}/api/user/activity/${
            user.googleId
          }/${currentMonth}/${currentYear}`
        );
        const data = await response.json();

        // Ensure activityData is always an array
        setActivityData(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        setActivityData([]);
      }
    };

    if (user) {
      fetchUserData();
      fetchActivityData();
    }
  }, [user, currentMonth, currentYear]);

  const getDaysInMonth = (year, month) => {
    return new Date(year, month, 0).getDate();
  };

  const hasActivity = (day) => {
    // Ensure activityData is an array before calling .some()
    if (!Array.isArray(activityData)) {
      return false;
    }

    return activityData.some((activity) => {
      if (!activity || !activity.date) return false;

      const date = new Date(activity.date);
      return (
        date.toISOString().split("T")[0].split("-")[2] ===
        String(day).padStart(2, "0")
      );
    });
  };

  const renderHeatmap = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-7 gap-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="text-xs text-center text-gray-500">
              {day}
            </div>
          ))}
          {Array(new Date(currentYear, currentMonth - 1, 1).getDay())
            .fill(null)
            .map((_, i) => (
              <div key={`empty-${i}`} className="w-8 h-8" />
            ))}
          {days.map((day) => {
            const activity = hasActivity(day);
            return (
              <div
                key={day}
                className={`w-8 h-8 rounded-md ${
                  activity ? "bg-primary" : "bg-white/5"
                } transition-all duration-200 hover:opacity-75 cursor-pointer relative group`}
              >
                <span
                  className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs ${
                    activity ? "text-white" : "text-gray-400"
                  }`}
                >
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getMonthName = (month) => {
    return new Date(0, month - 1).toLocaleString("default", { month: "long" });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Loader />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background p-8 flex items-center justify-center">
        <Card className="glass-card text-center p-6 border-white/10">
          <p className="text-gray-400 mb-4">
            Please login with Google to view your profile.
          </p>
          <Button
            onClick={() => login()}
            className="bg-gradient-to-r from-primary to-purple-400 hover:from-primary/90 hover:to-purple-500 text-white"
          >
            Login with Google
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="bg-background p-8" style={{ height: "calc(100vh - 6rem)" }}>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Your Profile</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* User Info Card */}
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2 border-b border-white/10">
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                User Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-4 py-4">
                <div className="relative">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-primary to-purple-400 opacity-70 blur-sm"></div>
                  <img
                    src={user.picture || "/placeholder.svg"}
                    alt="Profile"
                    className="relative w-24 h-24 rounded-full border-2 border-white/10 shadow-md"
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-white">
                    {user.username}
                  </h3>
                  <p className="text-gray-400">{user.email}</p>
                </div>
                <div className="w-full pt-4 border-t border-white/10">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-400">Member since</span>
                    <span className="font-medium text-white">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card
          <Card className="glass-card border-white/10">
            <CardHeader className="pb-2 border-b border-white/10">
              <CardTitle className="flex items-center gap-2">
                <BarChart className="w-5 h-5 text-primary" />
                Learning Stats
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-gray-400">Mind Maps</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {userData?.mindmapCount || 0}
                  </p>
                </div>

                <div className="glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Award className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-400">Mastered</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {userData?.masteredCount || 0}
                  </p>
                </div>

                <div className="glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-400">Streak</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {userData?.currentStreak || 0} days
                  </p>
                </div>

                <div className="glass-effect p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-gray-400">Nodes</span>
                  </div>
                  <p className="text-2xl font-bold text-white">
                    {userData?.clickedNodesCount || 0}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card> */}

          {/* Activity Heatmap */}
          <Card className="glass-card border-white/10 md:col-span-1">
            <CardHeader className="pb-2 border-b border-white/10">
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePrevMonth}
                  className="text-gray-400 border-white/10 hover:bg-white/5 hover:text-white"
                >
                  Previous
                </Button>
                <h3 className="text-lg font-medium flex items-center gap-2 text-white">
                  <Clock className="w-4 h-4 text-primary" />
                  {getMonthName(currentMonth)} {currentYear}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextMonth}
                  className="text-gray-400 border-white/10 hover:bg-white/5 hover:text-white"
                >
                  Next
                </Button>
              </div>
              {renderHeatmap()}
              <div className="mt-4 text-sm text-gray-500 text-center">
                Purple squares indicate days with learning activity
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
