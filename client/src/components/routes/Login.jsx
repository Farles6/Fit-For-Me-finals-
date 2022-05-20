import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Routes, Route, Link, Outlet } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { UsersContext } from "../providers/UserProvider";
import Navbar from "../Navbar";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";

export default function User() {
	const {
		emailSet,
		cookies,
		passwordSet,
		logout,
		handleSubmit,
		email,
		password,
	} = useContext(UsersContext);

	return (
		<Container component='main' maxWidth='xs'>
			<CssBaseline />
			<Box
				sx={{
					marginTop: 8,
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
				}}
			>
				<div className='logo'>
					<FitnessCenterIcon className='logo-icon'></FitnessCenterIcon>
					<span>FitForMe</span>
				</div>

				<Typography component='h1' variant='h5'>
					Sign in
				</Typography>
				<Box component='form' onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
					<TextField
						margin='normal'
						required
						fullWidth
						id='email'
						label='Email Address'
						value={email}
						onChange={e => emailSet(e)}
						name='email'
						autoComplete='email'
						autoFocus
					/>
					<TextField
						margin='normal'
						required
						fullWidth
						name='password'
						label='Password'
						value={password}
						onChange={e => passwordSet(e)}
						type='password'
						id='password'
						autoComplete='current-password'
					/>
					<Button
						type='submit'
						fullWidth
						variant='contained'
						sx={{ mt: 3, mb: 2 }}
					>
						Sign In
					</Button>
					<Grid container>
						<Grid item>
							<Link to='/signup' variant='body2'>
								Signup
							</Link>
							<Link to='/'>sada</Link>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
}
