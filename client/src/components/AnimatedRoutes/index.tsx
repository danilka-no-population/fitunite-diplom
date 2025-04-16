import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Login from '../../pages/Login';
import Register from '../../pages/Register';
import Home from '../../pages/Home';
import Workouts from '../../pages/Workouts';
import Meals from '../../pages/Meals';
import Progress from '../../pages/Progress';
import ProtectedRoute from '../ProtectedRoute';
import ProfilePage from '../../pages/ProfilePage';
import Programs from '../../pages/Programs';
import ProgramDetail from '../../pages/ProgramDetails';
import CreateProgram from '../../pages/CreateProgram';
import TrainerRoute from '../TrainerRoute';
import Favorites from '../../pages/Favorites';
import ClientRoute from '../ClientRoute';
import ClientsList from '../ClientsList';
import ClientProfile from '../../pages/ClientProfile';
import { PageWrapper } from '../PageWrapper';
import ScrollToTop from '../ScrollToTop';

const AnimatedRoutes: React.FC = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <ScrollToTop/>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
        <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />

        <Route element={<ProtectedRoute />}>
          <Route element={<ClientRoute />}>
            <Route path="/meals" element={<PageWrapper><Meals /></PageWrapper>} />
            <Route path="/progress" element={<PageWrapper><Progress /></PageWrapper>} />
          </Route>

          <Route path="/profile" element={<PageWrapper><ProfilePage /></PageWrapper>} />
          <Route path="/programs" element={<PageWrapper><Programs /></PageWrapper>} />
          <Route path="/programs/:id" element={<PageWrapper><ProgramDetail /></PageWrapper>} />
          <Route path="/favorites" element={<PageWrapper><Favorites /></PageWrapper>} />
          <Route path="/workouts" element={<PageWrapper><Workouts /></PageWrapper>} />

          <Route element={<TrainerRoute />}>
            <Route path="/create-program" element={<PageWrapper><CreateProgram /></PageWrapper>} />
            <Route path="/my-clients" element={<PageWrapper><ClientsList /></PageWrapper>} />
            <Route path="/profile/:id" element={<PageWrapper><ClientProfile /></PageWrapper>} />
          </Route>
        </Route>
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
