import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackSpaceIcon, Menu as MenuIcon } from "@mui/icons-material";
import { Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material';
import React, { Suspense, lazy, memo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { bgGradient, matBlack } from "../components/constants/color";
import { LayoutLoader } from '../components/layout/Loaders';
import AvatarCard from '../components/shared/AvatarCard';
import UserItem from '../components/shared/UserItem';
import { Link } from '../components/styles/StyledComponent';
import { useAsyncMutation, useErrors } from '../hooks/hook';
import { useChatDetailsQuery, useDeleteChatMutation, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../redux/api/api';
import { setIsAddMember } from "../redux/reducers/misc";

const ConfirmDeleteDialog = lazy(() => import("../components/dialogs/ConfirmDeleteDialog"));

const AddMemberDialog = lazy(() => import("../components/dialogs/AddMemberDialog"));


const Groups = () => {

    const chatId = useSearchParams()[0].get("group");

    const navigate = useNavigate();

    const dispatch = useDispatch();

    const { isAddMember } = useSelector((state) => state.misc);

    const myGroups = useMyGroupsQuery("");

    const groupDetails = useChatDetailsQuery(
        { chatId, populate: true },
        { skip: !chatId }
    );

    const [updateGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation);

    const [removeMember, isLoadingRemoveMember] = useAsyncMutation(useRemoveGroupMemberMutation);

    const [deleteGroup, isLoadingDeleteGroup] = useAsyncMutation(useDeleteChatMutation);

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [groupName, setGroupName] = useState("");
    const [groupNameUpdatedValue, setGroupNameUpdatedValue] = useState("");
    const [confirmDeleteDialog, setConfirmDeleteDialog] = useState(false);

    const [members, setMembers] = useState([]);

    const errors = [
        {
            isError: myGroups.isError,
            error: myGroups.error,
        },

        {
            isError: groupDetails.isError,
            error: groupDetails.error,
        },
    ];

    useErrors(errors);



    useEffect(() => {

        const groupData = groupDetails.data;

        console.log(groupData)

        if (groupData) {
            setGroupName(groupData.chat.name);
            setGroupNameUpdatedValue(groupData.chat.name);
            setMembers(groupData.chat.members);
        };

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setMembers([]);
            setIsEdit(false);
        };

    }, [groupDetails.data]);





    const navigateBack = () => {
        navigate("/");
    };

    const handleMobile = () => {
        setIsMobileMenuOpen((prev) => !prev)
    };

    const handleMobileClose = () => {
        setIsMobileMenuOpen(false);
    };

    const updateGroupName = () => {
        setIsEdit(false);
        updateGroup("Updating Group Name...", { chatId, name: groupNameUpdatedValue })
    };

    const openConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(true);
    };

    const closeConfirmDeleteHandler = () => {
        setConfirmDeleteDialog(false);
    };

    const openAddMemberHandler = () => {
        dispatch(setIsAddMember(true));
    };

    const deleteHandler = () => {
        deleteGroup("Deleting Group...", chatId);
        closeConfirmDeleteHandler();
        navigate("/groups");
    };

    const removeMemberHandler = (userId) => {


        removeMember("", { chatId, userId });

        console.log(userId)
    };

    useEffect(() => {

        if (chatId) {
            // setGroupName(`Group Name ${chatId}`);
            // setGroupNameUpdatedValue(`Group Name ${chatId}`);
        }

        return () => {
            setGroupName("");
            setGroupNameUpdatedValue("");
            setIsEdit(false);
        }

    }, [chatId]);



    const IconBtns = <>

        <Box sx={{
            display: {
                xs: "block",
                sm: "none",
                position: "fixed",
                right: "1rem",
                top: "1rem"
            }
        }}>
            <IconButton onClick={handleMobile} >
                <MenuIcon />
            </IconButton>
        </Box>

        <Tooltip title="Back">
            <IconButton sx={{
                position: "absolute",
                top: "2rem",
                left: "2rem",
                bgcolor: matBlack,
                color: "white",
                ":hover": {
                    bgcolor: "rgba(0,0,0,0.7)"
                }
            }}
                onClick={navigateBack}
            >
                <KeyboardBackSpaceIcon />
            </IconButton>
        </Tooltip>
    </>


    const GroupName = <Stack direction="row" alignItems="center" justifyContent="center" spacing="1rem" padding="3rem">

        {
            isEdit ? <>

                <TextField value={groupNameUpdatedValue} onChange={e => setGroupNameUpdatedValue(e.target.value)} />
                <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}><DoneIcon /></IconButton>

            </> : <>
                <Typography variant='h4'>
                    {groupName}
                </Typography>
                <IconButton onClick={() => setIsEdit(true)} disabled={isLoadingGroupName}><EditIcon /></IconButton>
            </>
        }

    </Stack>

    const ButtonGroup = (
        <Stack
            direction={{
                xs: "column-reverse",
                sm: "row"

            }}
            spacing={"1rem"}
            p={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem"
            }}
        >

            <Button size="large" color="error" variant="outlined" startIcon={<DeleteIcon />} onClick={openConfirmDeleteHandler}>Delete Group</Button>

            <Button size="large" variant="contained" startIcon={<AddIcon />} onClick={openAddMemberHandler}>Add Member</Button>

        </Stack>
    )


    return myGroups.isLoading ? <LayoutLoader /> : (
        <Grid container height={"100vh"}>
            <Grid item sm={4} sx={{
                display: {
                    xs: "none",
                    sm: "block"
                },
                backgroundImage: bgGradient,
            }} >
                <GroupList myGroups={myGroups?.data?.groups} chatId={chatId} />
            </Grid>

            <Grid item xs={12} sm={8} sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
                padding: "1rem 3rem"
            }}>

                {IconBtns}


                {groupName && <>

                    {GroupName}

                    <Typography margin={"2rem"} alignSelf={"flex-start"} variant={"body1"}>Members</Typography>

                    <Stack
                        maxWidth={"40rem"}
                        width={"100%"}
                        boxSizing={"border-box"}
                        padding={{
                            sm: "1rem",
                            xs: "0",
                            md: "1rem 4rem"
                        }}
                        spacing={"2rem"}

                        height={"50vh"}
                        overflow={"auto"}
                    >

                        {/* Members */}

                        {
                            isLoadingRemoveMember ? (<CircularProgress />) : (members.map((i) => (
                                <UserItem user={i} key={i._id} isAdded styling={{
                                    boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                                    padding: "1rem 2rem",
                                    borderRadius: "1rem"
                                }}
                                    handler={removeMemberHandler}
                                />
                            ))

                            )
                        }



                    </Stack>

                    {ButtonGroup}

                </>}





            </Grid>

            {
                isAddMember && (
                    <Suspense fallback={<Backdrop open />}><AddMemberDialog chatId={chatId} /></Suspense>
                )}

            {
                confirmDeleteDialog && <Suspense fallback={<Backdrop open />}>
                    <ConfirmDeleteDialog open={confirmDeleteDialog} handleClose={closeConfirmDeleteHandler} deleteHandler={deleteHandler} />
                </Suspense>
            }

            <Drawer sx={{
                display: {
                    xs: "block",
                    sm: "none",
                }
            }} open={isMobileMenuOpen} onClose={handleMobileClose}>
                <GroupList w={"50vw"} myGroups={myGroups?.data?.groups} chatId={chatId} />
            </Drawer>



        </Grid>
    );
};

const GroupList = ({ w = "100%", myGroups = [], chatId }) => (

    <Stack width={w}>
        {
            myGroups.length > 0 ? (
                myGroups.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id} />)
            ) : (
                <Typography textAlign={"center"} padding={"1rem"}>No Groups</Typography>
            )
        }
    </Stack>

);




const GroupListItem = memo(({ group, chatId }) => {
    const { name, avatar, _id } = group;

    return <Link to={`?group=${_id}`} onClick={(e) => {
        if (chatId === _id) {
            e.preventDefault();
        }
    }}>

        <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
            <AvatarCard avatar={avatar} />
            <Typography>{name}</Typography>
        </Stack>


    </Link>


});

export default Groups