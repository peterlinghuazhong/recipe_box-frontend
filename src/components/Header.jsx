import { Link, Navigate } from "react-router";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";

const Header = (props) => {
  const { current, title = "Welcome To My Recipe Box" } = props;
  const [cookies, setCookie, removeCookie] = useCookies(["currentuser"]);
  const navigate = useNavigate();
  const { currentuser } = cookies;
  return (
    <Box
      sx={{
        py: 4,
        textAlign: "center",
        borderBottom: "1px solid #ddd",
        mb: 3,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: "700",
        }}
      >
        {title}
      </Typography>
      {currentuser && (
        <Typography variant="body1" align="center">
          Current Logged In User:
          <br />
          {currentuser.name} ({currentuser.email})
        </Typography>
      )}
      <Box
        sx={{ display: "flex", gap: "10px", justifyContent: "center", mt: 2 }}
      >
        <Button
          component={Link}
          to="/"
          variant={current === "home" ? "contained" : "outlined"}
        >
          Home
        </Button>

        {currentuser ? (
          <Button
            variant="outlined"
            onClick={() => {
              // remove cookie
              removeCookie("currentuser");
              // redirect back to home page
              navigate("/");
            }}
          >
            Logout
          </Button>
        ) : (
          <>
            <Button
              component={Link}
              to="/login"
              variant={current === "login" ? "contained" : "outlined"}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/signup"
              variant={current === "signup" ? "contained" : "outlined"}
            >
              Sign Up
            </Button>
          </>
        )}
      </Box>
    </Box>
  );
};

export default Header;
