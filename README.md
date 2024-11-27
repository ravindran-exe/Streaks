# **Streak Day Habit Tracker**

Streak Day Habit Tracker is a modern web application that helps users track their daily habits, visualize progress through heatmaps, and categorize habits for better management. The app supports email/password login and Google authentication.

---

## **Features**

- **User Authentication**
  - Login with Email/Password or Google account.
  - Secure authentication powered by Firebase.
  - Password reset via email.

- **Habit Tracking**
  - Add, delete, and update habits.
  - Visualize streaks using customizable heatmaps.
  - Auto-capitalize habit names for consistency.



---


## **Setup Instructions**

### **Prerequisites**

- Node.js installed on your machine.
- Firebase project setup with the following configuration:
  - Authentication (Email/Password, Google Sign-In)
  - Firestore database

### **Steps**

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/streak-day-habit-tracker.git
   cd streak-day-habit-tracker
   ```

   ## **Installation Instructions**

### **Install Dependencies**

Run the following command to install the required dependencies:

```bash
npm install
```
Create a .env File
Create a .env file in the root directory and add your Firebase configuration:


```bash
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```
Start the Development Server
Run the following command to start the development server:

```bash
npm start
```

Open the app in your browser at:
```
http://localhost:3000 
```
### Happy Habit Tracking!
