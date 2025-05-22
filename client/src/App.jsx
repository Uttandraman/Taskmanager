import React from 'react';
import SignupPage from './SignUp';
import LoginPage from './Login';
import TaskListPage from './Task';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import CalendarPage from './Calendar/CalendarPage';

function App() {
  return (
    <Router>
      <AuthProvider>
      <Routes>
        <Route path='/' element={<SignupPage/>}></Route>
        <Route path='/login' element={<LoginPage/>}></Route>
        <Route path='/task' element={<TaskListPage/>}></Route>
        <Route path='/calendar' element={<CalendarPage/>}></Route>
      </Routes>
      </AuthProvider>
    </Router>
  )
}

export default App;
