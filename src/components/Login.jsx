import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Login(props) {
  const url = props.url;

  if (localStorage.getItem("userData")) {
    window.location.href = "/shopping";
  }

  const [hover, setHover] = useState(false);

  const [admin, setAdmin] = useState(false);

  const [signUp, setSignUp] = useState(false);

  ///////Register
  async function newUser(evt) {
    evt.preventDefault();
    let otp = document.getElementById("userOtp");

    const { fName, lName, email } = evt.target;
    const registerBody = {
      first_name: fName.value,
      last_name: lName.value,
      email: email.value,
      otp: Number(otp.value),
    };
    if (!fName.value || !lName.value || !email.value) {
      toast.error("Insufficient information!");
      return;
    }

    try {
      const result = await fetch(`${url}/otp/register`, {
        method: "POST",
        body: JSON.stringify(registerBody),
      });

      const jsonResult = await result.json();

      toast.success(jsonResult?.message);

      if (jsonResult?.data) {
        localStorage.setItem("userData", JSON.stringify(jsonResult.data));
        window.location.href = "/shopping";
      }
    } catch (e) {
      console.log(e);
    }
  }

  ////////Login
  async function oldUser(evt) {
    evt.preventDefault();
    const { email, otp } = evt.target;
    const loginBody = {
      email: email.value,
      otp: Number(otp.value),
    };

    if (!email.value || !otp.value) {
      toast.error("All fields are mandatory!");
      return;
    }

    try {
      const result = await fetch(`${url}/otp/user`, {
        method: "POST",
        body: JSON.stringify(loginBody),
      });

      const jsonResult = await result.json();

      toast.success(jsonResult?.message);

      if (jsonResult?.data) {
        localStorage.setItem("userData", JSON.stringify(jsonResult.data));
        window.location.href = "/shopping";
      }
    } catch (e) {
      console.log(e);
    }
  }

  ////////Admin Login
  async function adminLogin(evt) {
    evt.preventDefault();
    const { email, otp } = evt.target;
    const loginBody = {
      email: email.value,
      otp: Number(otp.value),
    };

    if (!email.value || !otp.value) {
      toast.error("All fields are mandatory!");
      return;
    }

    try {
      const result = await fetch(`${url}/otp/admin`, {
        method: "POST",
        body: JSON.stringify(loginBody),
      });

      const jsonResult = await result.json();

      toast.success(jsonResult?.message);

      if (jsonResult?.data) {
        localStorage.setItem("userData", JSON.stringify(jsonResult.data));
        localStorage.setItem("admin", true);
        window.location.href = "/shopping";
      }
    } catch (e) {
      console.log(e);
    }
  }

  //////OTP
  async function sendOtp() {
    let input1 = admin ? "adminEmail" : "userEmail";
    const email = document.getElementById(input1).value;

    if (!email) {
      toast.error("Missing email!");
      return;
    }

    const resultBody = {
      email,
    };

    const loginType = admin
      ? "login/admin"
      : signUp
      ? "register"
      : "login/user";

    console.log("111", loginType);

    try {
      const result = await fetch(`${url}/${loginType}`, {
        method: "POST",
        body: JSON.stringify(resultBody),
      });

      const jsonResult = await result.json();
      toast.success(jsonResult?.message);
    } catch (e) {
      console.log(e);
    }
  }

  return (
    <div className="login" style={{ boxShadow: "0 0 20px #DD5353" }}>
      <h1 className="navStyle">
        Online Store {admin && <span style={{ color: "grey" }}>(Admin)</span>}
      </h1>

      {hover && (
        <p className="hoverText">Login As {admin ? "User" : "Admin"}</p>
      )}
      <i
        onMouseOver={() => setHover(true)}
        onMouseOut={() => setHover(false)}
        onClick={() => {
          setAdmin(!admin);
        }}
        className="fa-solid user fa-user"
      ></i>

      <div style={{ display: admin ? "none" : "block" }}>
        <form onSubmit={signUp ? newUser : oldUser}>
          {signUp && (
            <div>
              <input
                type="text"
                name="fName"
                className="mb-3 form-control"
                placeholder="First Name"
              />
              <input
                type="text"
                name="lName"
                className="mb-3 form-control"
                placeholder="Last Name"
              />
            </div>
          )}

          <input
            type="email"
            name="email"
            id="userEmail"
            className="mb-3 form-control"
            placeholder="Email"
          />

          <div className="hstack">
            <input
              type="number"
              name="otp"
              id="userOtp"
              style={{ width: "40%" }}
              className="mb-3 form-control"
              placeholder="OTP"
            />
            <button
              type="button"
              onClick={sendOtp}
              name="button"
              className="mb-3 ms-3 btn btn-info"
            >
              Send OTP
            </button>
          </div>

          <button type="submit" className="btn btn-success">
            {signUp ? "Sign Up" : "Login"}
          </button>
        </form>

        <br />
        <br />

        <p>
          <strong>
            {signUp ? "Already have an account:  " : "New User:  "}
          </strong>
          <span
            style={{
              cursor: "pointer",
              fontWeight: "bolder",
              color: "#7743DB",
            }}
            onClick={() => setSignUp(!signUp)}
          >
            {signUp ? " Login" : " Sign Up"}
          </span>
        </p>
      </div>

      <div style={{ display: admin ? "block" : "none" }}>
        <form onSubmit={adminLogin} method="post">
          <input
            type="email"
            name="email"
            id="adminEmail"
            className="mb-3 form-control"
            placeholder="Email"
          />

          <div className="hstack">
            <input
              type="number"
              name="otp"
              id="adminOtp"
              style={{ width: "40%" }}
              className="mb-3 form-control"
              placeholder="OTP"
            />
            <button
              type="button"
              onClick={sendOtp}
              name="button"
              className="mb-3 ms-3 btn btn-info"
            >
              Send OTP
            </button>
          </div>
          <button type="submit" name="button" className="btn btn-success">
            Login
          </button>
        </form>
      </div>

      <ToastContainer
        position="top-left"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
}

export default Login;
