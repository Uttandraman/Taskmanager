import React from 'react';
import SignupPage from './SignUp';
import LoginPage from './Login';
import TaskListPage from './Task';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import CalendarPage from './Calendar/CalendarPage';
import SettingsPage from './Settingpage/SettingsPage';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path='/' element={<LoginPage/>}></Route>
        <Route path='/signup' element={<SignupPage/>}></Route>
        <Route path='/task' element={<TaskListPage/>}></Route>
        <Route path='/calendar' element={<CalendarPage/>}></Route>
        <Route path='/settings' element={<SettingsPage/>}></Route>
      </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App;
