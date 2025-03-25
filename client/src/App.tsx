import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import Home from './pages/Home';
import Workouts from './pages/Workouts';
import Meals from './pages/Meals';
import Progress from './pages/Progress';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from './pages/ProfilePage';
import Programs from './pages/Programs';
import ProgramDetail from './pages/ProgramDetails';
import CreateProgram from './pages/CreateProgram';
import TrainerRoute from './components/TrainerRoute';
import Favorites from './pages/Favorites';
import ClientRoute from './components/ClientRoute';
import ClientsList from './components/ClientsList';
import ClientProfile from './pages/ClientProfile';

const App: React.FC = () => {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<ClientRoute/>}>
            {/* <Route path="/workouts" element={<Workouts />} /> */}
            <Route path="/meals" element={<Meals />} />
            <Route path="/progress" element={<Progress />} />
          </Route>
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/programs" element={<Programs />} />
          <Route path="/programs/:id" element={<ProgramDetail />} />
          <Route path="/favorites" element={<Favorites />} />
          <Route path="/workouts" element={<Workouts />} />
          <Route element={<TrainerRoute />}>
            <Route path="/create-program" element={<CreateProgram />} />
            <Route path="/my-clients" element={<ClientsList />} />
            <Route path="/profile/:id" element={<ClientProfile />} />
            {/* <Route path="/workouts" element={<Workouts />} /> */}
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default App;