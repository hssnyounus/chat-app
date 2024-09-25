import { Drawer, Grid, Skeleton } from '@mui/material';
import React, { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, REFETCH_CHATS } from '../../constants/events';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { getOrSaveFromLocalStorage } from '../../lib/features';
import { useMyChatsQuery } from '../../redux/api/api';
import { incrementNotification, setNewMessagesAlert } from "../../redux/reducers/chat";
import { setIsDeleteMenu, setIsMobile, setSelectedDeleteChat } from '../../redux/reducers/misc';
import { getSocket } from '../../socket';
import DeleteChatMenu from '../dialogs/DeleteChatMenu';
import Title from '../shared/Title';
import ChatList from '../specific/ChatList';
import Profile from '../specific/Profile';
import Header from './Header';

const AppLayout = () => WrapedComponent => {
    return (props) => {

        const params = useParams();
        const navigate = useNavigate();
        const dispatch = useDispatch();
        const chatId = params.chatId;
        const deleteMenuAnchor = useRef(null);

        const socket = getSocket();

        const { isMobile } = useSelector((state) => state.misc);
        const { user } = useSelector((state) => state.auth);
        const { newMessagesAlert } = useSelector((state) => state.chat);

        const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

        useErrors([{ isError, error }]);

        useEffect(() => {
            getOrSaveFromLocalStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
        }, [newMessagesAlert]);

        const handleDeleteChat = (e, chatId, groupChat) => {
            dispatch(setIsDeleteMenu(true));
            dispatch(setSelectedDeleteChat({ chatId, groupChat }));
            deleteMenuAnchor.current = e.currentTarget;
        };


        const newMessageAlertListner = useCallback((data) => {

            if (data.chatId === chatId) return;

            dispatch(setNewMessagesAlert(data));
        }, [chatId]);

        const newRequestListner = useCallback(() => {

            dispatch(incrementNotification());


        }, [dispatch]);

        const refetchListner = useCallback(() => {
            refetch();
            navigate("/");
        }, [refetch, navigate]);

        const handleMobileClose = () => dispatch(setIsMobile(false));

        const eventHandlers = {
            [NEW_MESSAGE_ALERT]: newMessageAlertListner,
            [NEW_REQUEST]: newRequestListner,
            [REFETCH_CHATS]: refetchListner,
        };

        useSocketEvents(socket, eventHandlers);

        return (
            <>
                <Title />
                <Header />

                <DeleteChatMenu dispatch={dispatch} deleteMenuAnchor={deleteMenuAnchor} />

                {
                    isLoading ? (<Skeleton />) : (
                        <Drawer open={isMobile} onClose={handleMobileClose}>
                            <ChatList w="70vw" chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} />
                        </Drawer>
                    )
                }

                <Grid container height={"calc(100vh - 4rem)"} >

                    <Grid
                        item
                        sm={4}
                        md={3}
                        sx={{
                            display: {
                                xs: "none",
                                sm: "block"
                            }
                        }}
                        height={"100%"}
                    >
                        {
                            isLoading ? (<Skeleton />) : (
                                <ChatList chats={data?.chats} chatId={chatId} handleDeleteChat={handleDeleteChat} newMessagesAlert={newMessagesAlert} />
                            )
                        }
                    </Grid>

                    <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"} >
                        <WrapedComponent {...props} chatId={chatId} user={user} />
                    </Grid>

                    <Grid item md={4} lg={3} height={"100%"} sx={{
                        display: {
                            xs: "none",
                            md: "block"
                        },
                        padding: "2rem",
                        bgcolor: "rgba(0,0,0,0.85)"
                    }}>
                        <Profile user={user} />
                    </Grid>


                </Grid>



            </>
        )
    }
}

export default AppLayout