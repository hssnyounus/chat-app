import { Avatar, IconButton, ListItem, Stack, Typography } from '@mui/material';
import React, { memo } from 'react';
import { Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { transformImage } from '../../lib/features';

const UserItem = ({ user, handler, handlerIsLoading, isAdded = false, styling = {} }) => {

    const { avatar, name, _id } = user;


    return (
        <ListItem>
            <Stack
                direction={"row"}
                alignItems={"center"}
                spacing={"1rem"}
                width={"100%"}
                {...styling}
            >

                <Avatar src={transformImage(avatar)} />

                <Typography
                    variant='body1'
                    sx={{
                        flexGlow: 1,
                        display: "-webkit-box",
                        WebkitLineClamp: "vertical",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        width: "100%"
                    }}

                >

                    {name}

                </Typography>

                <IconButton
                    onClick={() => handler(_id)}
                    disabled={handlerIsLoading}
                    size="small"
                    sx={{
                        bgcolor: isAdded ? "error.main" : "primary.main",
                        color: "white",
                        "&:hover": {
                            bgcolor: isAdded ? "error.dark" : "primary.dark"
                        }
                    }}
                >

                    {
                        isAdded ? <RemoveIcon /> : <AddIcon />
                    }



                </IconButton>

            </Stack>
        </ListItem>
    )
}

export default memo(UserItem)