import Header from "../../components/Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import validator from "email-validator";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { signup } from "../../utils/api_auth";
import { useCookies } from "react-cookie";
const SignUp = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleFormSubmit = async () => {
    try {
      // 1. check for error
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Please fill up all the fields");
      } else if (!validator.validate(email)) {
        // 2. make sure the email is valid
        toast.error("Please use a valid email address");
      } else if (password !== confirmPassword) {
        // 2. check for password match
        toast.error("Password is not match");
      } else {
        const userData = await signup(name, email, password);

        // set cookies
        setCookie("currentuser", userData, {
          maxAge: 60 * 60 * 8, // expire in 8 hours
        });
        toast.success("You have successfully signed up an account!");
        navigate("/login");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response);
    }
  };

  return (
    <>
      <Header current="signup" />
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" mb={2}>
          Create New Account
        </Typography>
        <Box mb={2}>
          <TextField
            label="Name"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            type="password"
            label="Password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <TextField
            type="password"
            label="Confirm Password"
            fullWidth
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </Box>
        <Box mb={2}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleFormSubmit}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default SignUp;
