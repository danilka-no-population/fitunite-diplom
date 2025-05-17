import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Register from './pages/Register';
import Header from './components/Header';
// import Home from './pages/Home';
// import Workouts from './pages/Workouts';
// import Meals from './pages/Meals';
// import Progress from './pages/Progress';
// import ProtectedRoute from './components/ProtectedRoute';
// import ProfilePage from './pages/ProfilePage';
// import Programs from './pages/Programs';
// import ProgramDetail from './pages/ProgramDetails';
// import CreateProgram from './pages/CreateProgram';
// import TrainerRoute from './components/TrainerRoute';
// import Favorites from './pages/Favorites';
// import ClientRoute from './components/ClientRoute';
// import ClientsList from './components/ClientsList';
// import ClientProfile from './pages/ClientProfile';
import Chat from './components/Chat';
import { AuthContext } from './authContext'; 
import AnimatedRoutes from './components/AnimatedRoutes';

const App: React.FC = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Router>
      <Header />
      <AnimatedRoutes />
      {isAuthenticated && <Chat />}
    </Router>
  );
};

export default App;