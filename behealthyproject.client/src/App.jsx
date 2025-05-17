import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUpPageUser from './components/SignUpPageUser';
import SignUpPageDietitian from './components/SignUpPageDietitian';
import ResetPassword from './components/ResetPassword';
import DietitianPage from './components/DietitianPage';
import LoginPageDietitian from './components/LoginPageDietitian';
import LoginPageUser from './components/LoginPageUser';
import CompleteUserProfile from './components/CompleteUserProfile';
import UserPage from './components/UserPage';
import UserProfile from './components/UserProfile';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import Forbidden from './components/Forbidden';
import CompleteDietitianProfile from './components/CompleteDietitianProfile';
import DietitianProfile from './components/DietitianProfile';
import DietitiansListForUser from './components/DietitiansListForUser';
import CreateProgramPage from './components/CreateProgramPage';
import AdminLogin from './components/AdminLogin'
import AdminPage from './components/AdminPage';
import PendingPage from './components/PendingPage';
import DeclinedPage from './components/DeclinedPage';
import AddBalancePage from './components/AddBalancePage';
import UserChatPage from './components/UserChatPage';
import DietitianChatPage from './components/DietitianChatPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPageUser />} />
                <Route path="/signin/dietitian" element={<LoginPageDietitian />} />
                <Route path="/signup/user" element={<SignUpPageUser />} />
                <Route path="/signup/dietitian" element={<SignUpPageDietitian />} />
                <Route path="/resetpassword" element={<ResetPassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/forbidden" element={<Forbidden />} />
                <Route path="/adminlogin" element={<AdminLogin />} />

                <Route path="/dietitianpage" element={
                    <ProtectedRoute requiredRole="dietitian">
                        <DietitianPage />
                    </ProtectedRoute>
                } />
                <Route path="/completeuserprofile" element={
                    <ProtectedRoute requiredRole="user">
                        <CompleteUserProfile />
                    </ProtectedRoute>
                } />
                <Route path="/completedietitianprofile" element={
                    <ProtectedRoute requiredRole="dietitian">
                        <CompleteDietitianProfile />
                    </ProtectedRoute>
                } />
                <Route path="/userpage" element={
                    <ProtectedRoute requiredRole="user">
                        <UserPage />
                    </ProtectedRoute>
                } />
                <Route path="/userprofile" element={
                    <ProtectedRoute requiredRole="user">
                        <UserProfile />
                    </ProtectedRoute>
                } />
                <Route path="/dietitianslist" element={
                    <ProtectedRoute requiredRole="user">
                        <DietitiansListForUser />
                    </ProtectedRoute>
                } />
                <Route path="/createprogram" element={
                    <ProtectedRoute requiredRole="dietitian">
                        <CreateProgramPage />
                    </ProtectedRoute>
                } />
                <Route path="/dietitianprofile" element={
                    <ProtectedRoute requiredRole="dietitian">
                        <DietitianProfile />
                    </ProtectedRoute>
                } />
                <Route path="/dietitianchat" element={
                    <ProtectedRoute requiredRole="dietitian">
                        <DietitianChatPage />
                    </ProtectedRoute>
                } />
                <Route path="/userchat" element={
                    <ProtectedRoute requiredRole="user">
                        <UserChatPage />
                    </ProtectedRoute>
                } />

                <Route path="/adminpage" element={
                    <ProtectedRoute requiredRole="admin">
                        <AdminPage />
                    </ProtectedRoute>
                } />

                <Route path="/pendingpage" element={
                    <ProtectedRoute requiredRole="dietitian">
                        <PendingPage />
                    </ProtectedRoute>
                } />

                <Route path="/declinedpage" element={
                    <ProtectedRoute requiredRole="dietitian">
                        <DeclinedPage />
                    </ProtectedRoute>
                } />

                <Route path="/addbalance" element={
                    <ProtectedRoute requiredRole="user">
                        <AddBalancePage />
                    </ProtectedRoute>
                } />

            </Routes>
        </Router>
    );
}

export default App;
