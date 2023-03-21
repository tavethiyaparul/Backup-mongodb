import React from "react";
import axios from "axios";
import {
  Alert,
  Button,
  FormControl,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

const Login = () => {
  const navigate = useNavigate();
  // const [password,setPassword]=useState("")

  const [values, setValues] = React.useState({
    password: "",
    showPassword: false,
  });

  const handleChange = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  //alert
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios
      .post(
        "http://localhost:5000/login",
        { password: values.password },
        { headers: "Content-Type: application/json" }
      )
      .then((res) => {
        console.log(res);
        if (res.data === "login successfully") {
          navigate("/tab");
        } else {
          setOpen(true);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div style={{ backgroundColor: "blue" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh",
          backgroundColor: "white",
        }}
      >
        <FormControl sx={{ m: 1, width: "25ch" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password" color="primary">
            Password
          </InputLabel>
          <Input
            id="outlined-adornment-password"
            type={values.showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange("password")}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  color="primary"
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
          />

          {/* </FormControl> */}

          <br />
          {/* <FormControl> */}
          {/* <IconButton aria-label="delete" color='primary' onClick={handleSubmit} variant="contained">
        <ArrowForwardRoundedIcon />
        </IconButton> */}

          <Button
            variant="contained"
            endIcon={<ArrowForwardRoundedIcon />}
            onClick={handleSubmit}
          >
            LOGIN
          </Button>
        </FormControl>
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Invalid Password!
        </Alert>
      </Snackbar>
      
      {/* <form onSubmit={handleSubmit}>
    <label>Enter your password:
      <input 
        type="text" 
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
    </label>
    <input type="submit" /> 
  </form> */}
    </div>
  );
};

export default Login;
