import React, { useState, useEffect } from "react";
import CalendarHeatmap from "react-calendar-heatmap";
import "react-calendar-heatmap/dist/styles.css";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";
import "../styles/Dashboard.css";

const Dashboard = () => {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid;
  useEffect(() => {
    const fetchHabits = async () => {
      if (!userId) return;
      setLoading(true);
      try {
        const q = query(collection(db, "habits"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const fetchedHabits = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setHabits(fetchedHabits);
      } catch (error) {
        console.error("Error fetching habits:", error.message);
        alert("Failed to load habits. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchHabits();
  }, [userId]);

  // Add new habit
  const handleAddHabit = async () => {
    if (!newHabit.trim()) {
      alert("Habit name cannot be empty!");
      return;
    }

    const habitData = {
      name: newHabit.trim().charAt(0).toUpperCase() + newHabit.trim().slice(1),
      completedDates: [],
      userId,
    };

    try {
      const docRef = await addDoc(collection(db, "habits"), habitData);
      setHabits((prev) => [...prev, { ...habitData, id: docRef.id }]);
      setNewHabit("");
      console.log("Habit added successfully:", docRef.id);
    } catch (error) {
      console.error("Error creating habit:", error.message);
      alert("Error creating habit: " + error.message);
    }
  };

  // Mark habit as completed or incomplete
  const toggleCompletion = async (habitId) => {
    const today = new Date().toISOString().split("T")[0];
    const habit = habits.find((h) => h.id === habitId);

    const updatedDates = habit.completedDates.includes(today)
      ? habit.completedDates.filter((date) => date !== today)
      : [...habit.completedDates, today];

    try {
      await updateDoc(doc(db, "habits", habitId), { completedDates: updatedDates });
      setHabits((prev) =>
        prev.map((h) => (h.id === habitId ? { ...h, completedDates: updatedDates } : h))
      );
      console.log(`Habit "${habit.name}" updated for today.`);
    } catch (error) {
      console.error("Error updating habit:", error.message);
      alert("Error updating habit. Please try again.");
    }
  };

  // Delete a habit
  const handleDeleteHabit = async (habitId) => {
    try {
      await deleteDoc(doc(db, "habits", habitId));
      setHabits((prev) => prev.filter((h) => h.id !== habitId));
      console.log("Habit deleted successfully:", habitId);
    } catch (error) {
      console.error("Error deleting habit:", error.message);
      alert("Error deleting habit. Please try again.");
    }
  };

  // Logout the user
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("User signed out successfully.");
      window.location.href = "/login"; // Redirect to the login page
    } catch (error) {
      console.error("Error signing out:", error.message);
      alert("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="dashboard-container">
      {/* Header Section */}
      <div className="header-container">
        <h1 className="header-title">Habit Tracker</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </div>
  
      {/* Rest of the Dashboard Content */}
      <div className="add-habit">
        <input
          type="text"
          value={newHabit}
          onChange={(e) => setNewHabit(e.target.value)}
          placeholder="Enter new habit"
          className="habit-input"
        />
        <button onClick={handleAddHabit} className="add-button">Add Habit</button>
      </div>
  
      {loading ? (
        <p>Loading habits...</p>
      ) : (
        <div className="habit-list">
          {habits.map((habit) => {
            const today = new Date().toISOString().split("T")[0];
            const isCompletedToday = habit.completedDates.includes(today);
  
            return (
              <div key={habit.id} className="habit-item">
                <div className="habit-header">
                  <h3>{habit.name}</h3>
                  <div>
                    <button
                      onClick={() => toggleCompletion(habit.id)}
                      className={`toggle-button ${isCompletedToday ? "completed" : "incomplete"}`}
                    >
                      {isCompletedToday ? "Mark as Incomplete" : "Mark as Completed"}
                    </button>
                    <button
                      onClick={() => handleDeleteHabit(habit.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                {/* Heatmap */}
                <CalendarHeatmap
                  startDate={new Date(new Date().setFullYear(new Date().getFullYear() - 1))}
                  endDate={new Date()}
                  values={habit.completedDates.map((date) => ({ date, count: 1 }))}
                  classForValue={(value) => (!value ? "color-empty" : "color-filled")}
                  gutterSize={1}
                  showWeekdayLabels={false}
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
  
};

export default Dashboard;
