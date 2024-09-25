import React, { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectRoute from './components/auth/ProtectRoute';
import { LayoutLoader } from './components/layout/Loaders';
import { server } from "./constants/config";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { userExits, userNotExits } from './redux/reducers/auth';
import { Toaster } from "react-hot-toast";
import { SocketProvider } from './socket';



const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));

const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagment = lazy(() => import("./pages/admin/UserManagment"));
const ChatManagment = lazy(() => import("./pages/admin/ChatManagment"));
const MessageManagment = lazy(() => import("./pages/admin/MessageManagment"));



const App = () => {

  const { user, loader } = useSelector(state => state.auth);

  const dispatch = useDispatch();

  useEffect(() => {
    axios.get(`${server}/api/v1/user/me`, { withCredentials: true }).then(({ data }) => dispatch(userExits(data.user))).catch((error) => dispatch(userNotExits()));
  }, [dispatch]);


  return loader ? (<LayoutLoader />) : (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoader />}>

        <Routes>
          <Route element={<SocketProvider>
            <ProtectRoute user={user} />
          </SocketProvider>}>
            <Route path='/' element={<Home />} />
            <Route path='/chat/:chatId' element={<Chat />} />
            <Route path='/groups' element={<Groups />} />
          </Route>
          <Route path='/login' element={
            <ProtectRoute user={!user} redirect='/'>
              <Login />
            </ProtectRoute>} />

          <Route path='/admin' element={<AdminLogin />} />
          <Route path='/admin/dashboard' element={<Dashboard />} />
          <Route path='/admin/users-managment' element={<UserManagment />} />
          <Route path='/admin/chat-managment' element={<ChatManagment />} />
          <Route path='/admin/messages' element={<MessageManagment />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="bottom-center" />
    </BrowserRouter>
  )
}

export default App