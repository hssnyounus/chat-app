import React, { useState } from 'react';
import { Avatar, Button, Container, IconButton, Paper, Stack, TextField, Typography } from '@mui/material';
import { CameraAlt as CameraAltIcon } from "@mui/icons-material";
import { VisuallyHiddenInput } from '../components/styles/StyledComponent';
import { useFileHandler, useInputValidation } from '6pp';
import { usernameValidator } from '../utils/validators';
import toast from 'react-hot-toast';
import { server } from '../constants/config';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { userExits } from "../redux/reducers/auth.js";

const Login = () => {

  const [isLogin, setIsLogin] = useState(true);

  const toggleLogin = () => setIsLogin((prev) => !prev);

  const name = useInputValidation("");
  const bio = useInputValidation("");
  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");

  const avatar = useFileHandler("single");

  const dispatch = useDispatch();


  const handleSignUp = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("avatar", avatar.file);
    formData.append("name", name.value);
    formData.append("bio", bio.value);
    formData.append("username", username.value);
    formData.append("password", password.value);

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/new`,
        formData,
        config
      );

      dispatch(userExits(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    };
  };

  const handleLogIn = async (e) => {
    e.preventDefault();

    const config = {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        {
          username: username.value,
          password: password.value,
        },
        config
      );
      dispatch(userExits(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    };
  };



  return (

    <div style={{ backgroundImage: "linear-gradient(rgba(255,255,209),rgba(249,159,159))" }}>

      <Container component={"main"} maxWidth='xs' sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: 'center'
      }}>

        <Paper elevation={3} sx={{ padding: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

          {
            isLogin ? <>

              <Typography variant='h5'>Login</Typography>

              <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleLogIn}>

                <TextField required fullWidth label='Username' margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler} />

                <TextField required fullWidth label='Password' margin='normal' type='password' variant='outlined' value={password.value} onChange={password.changeHandler} />

                <Button sx={{
                  marginTop: "1rem"
                }} variant='contained' color='primary' type='submit' fullWidth>
                  Login
                </Button>

                <Typography textAlign={"center"} m={'1rem'}>
                  Or
                </Typography>

                <Button fullWidth variant='text' type='submit' onClick={toggleLogin}>
                  Sign Up Instead
                </Button>

              </form>


            </> : <>

              <Typography variant='h5'>Sign Up</Typography>

              <form style={{ width: "100%", marginTop: "1rem" }} onSubmit={handleSignUp}>

                <Stack position={"relative"} width={"10rem"} margin={"auto"}>

                  <Avatar sx={{
                    width: '7rem',
                    height: '7rem',
                    margin: 'auto',
                    objectFit: 'contain'
                  }}

                    src={avatar.preview}

                  />

                  <IconButton sx={{
                    position: 'absolute',
                    bottom: "0",
                    right: "0",
                    color: "white",
                    bgcolor: "rgba(0,0,0,0.5)",
                    ":hover": {
                      bgcolor: "rgba(0,0,0,0.7)"
                    }
                  }}

                    component='label'

                  >
                    <>
                      <CameraAltIcon />
                      <VisuallyHiddenInput type='file' onChange={avatar.changeHandler} />
                    </>
                  </IconButton>

                </Stack>

                {
                  avatar.error && (
                    <Typography m={"1rem auto"} width={"fit-content"} display={"block"} textAlign={"center"} color="error" variant='caption'>
                      {avatar.error}
                    </Typography>
                  )
                }

                <TextField required fullWidth label='Name' margin='normal' variant='outlined' value={name.value} onChange={name.changeHandler} />

                <TextField required fullWidth label='Bio' margin='normal' variant='outlined' value={bio.value} onChange={bio.changeHandler} />

                <TextField required fullWidth label='Username' margin='normal' variant='outlined' value={username.value} onChange={username.changeHandler} />

                {
                  username.error && (
                    <Typography color="error" variant='caption'>
                      {username.error}
                    </Typography>
                  )
                }

                <TextField required fullWidth label='Password' margin='normal' type='password' variant='outlined' value={password.value} onChange={password.changeHandler} />


                <Button sx={{
                  marginTop: "1rem"
                }} variant='contained' color='primary' type='submit' fullWidth>
                  Sign Up
                </Button>

                <Typography textAlign={"center"} m={'1rem'}>
                  Or
                </Typography>

                <Button fullWidth variant='text' type='submit' onClick={toggleLogin}>
                  Login Up Instead
                </Button>

              </form>


            </>
          }


        </Paper>

      </Container>

    </div>
  )
}

export default Login