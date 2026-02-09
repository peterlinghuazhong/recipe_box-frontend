import Header from "../../components/Header";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router";
import { login } from "../../utils/api_auth";
import { useCookies } from "react-cookie";
const Login = () => {
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleFormSubmit = async () => {
    try {
      // 1. check for error
      if (!email || !password) {
        toast.error("Please fill up all the fields");
      } else {
        const userData = await login(email, password);
        console.log(userData);
        // setcookie
        setCookie("currentuser", userData, {
          maxAge: 60 * 60 * 8, // expire in 8 hours
        });
        toast.success("You have successfully logged in!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      console.log(error.response);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <Header current="login" />
      <Container maxWidth="sm">
        <Typography variant="h3" align="center" mb={2}>
          Login To Your Account
        </Typography>
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

export default Login;
