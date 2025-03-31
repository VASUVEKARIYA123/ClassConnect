import React, { useState ,useEffect} from "react";
import { useHistory } from "react-router-dom";
import styled, { createGlobalStyle } from "styled-components";
import Header from "../Header";
import DoubtButton from "../common/ButtonDoubt";


// Hide Logout Button
const GlobalStyle = createGlobalStyle`
  .logoutBtn {
    display: none !important;
  }
`;


// Styled Components
const FormWrapper = styled.div`
  max-width: 50vw;
  margin: 40px auto;
  padding: 20px;
  background: snow;
  border: 1px solid #ccc;
  border-radius: 8px;
`;


const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border-radius: 5px;
  border: 1px solid #ccc;
`;


const RadioGroup = styled.div`
  margin-bottom: 15px;
  display: flex;
  gap: 15px;
`;


const Button = styled.button`
  padding: 10px 15px;
  border: none;
  border-radius: 5px;
  background: #007bff;
  color: white;
  cursor: pointer;
  width: 100%;
  font-size: 1rem;
  transition: background 0.3s;


  &:hover {
    background: #0056b3;
  }
`;


const Message = styled.p`
  text-align: center;
  font-size: 1rem;
  font-weight: bold;
  margin-top: 10px;
  color: ${({ success }) => (success ? "green" : "red")};
`;

// Clear localStorage on component mount

export default function Login() {
  const [credentials, setCredentials] = useState({ email: "", password: "", role: "" });
  const [message, setMessage] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isRoleChanged, setIsRoleChanged] = useState(false); // Track if role has been changed after first selection
  const history = useHistory();
  // localStorage.clear();
  useEffect(() => {
    localStorage.clear();
  }, []); 

  const handleChange = (e) => {
    const { name, value, type } = e.target;


    setCredentials((prev) => ({
      ...prev,
      [name]: type === "radio" ? value : value,
      ...(type === "radio" && isRoleChanged ? { email: "", password: "" } : {}), // Clear fields only after first selection
    }));


    if (type === "radio" && !isRoleChanged) {
      setIsRoleChanged(true); // Set flag after first role selection
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });


      const responseData = await response.json();
      if (response.ok) {
        localStorage.setItem("role", responseData.user.role);
        localStorage.setItem("token", responseData.token);
        localStorage.setItem("facultiesId", responseData.user.id);
        localStorage.setItem("name", responseData.user.name);
  

        setMessage("Login Successful!");
        setSuccess(true);
        setTimeout(() => {
          history.push("/subject");
          window.location.reload();
        }, 1500);
      } else {
        setMessage(responseData.message || "Invalid credentials. Please try again.");
        setSuccess(false);
      }
    } catch (error) {
      setMessage("Error: " + error.message);
      setSuccess(false);
    }
  };


  return (
    <>
      <GlobalStyle />
      <Header />
      <FormWrapper>
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
          <Input
            type="text"
            name="email"
            placeholder="Email"
            required
            value={credentials.email}
            onChange={handleChange}
          />
          <Input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={credentials.password}
            onChange={handleChange}
          />


          <RadioGroup>
            <label>
              <input
                type="radio"
                name="role"
                value="teacher"
                checked={credentials.role === "teacher"}
                onChange={handleChange}
              /> Teacher
            </label>
            <label>
              <input
                type="radio"
                name="role"
                value="student"
                checked={credentials.role === "student"}
                onChange={handleChange}
              /> Student
            </label>
          </RadioGroup>


          <Button type="submit">Login</Button>
        </form>
        {message && <Message success={success}>{message}</Message>}
      </FormWrapper>
      <DoubtButton />
    </>
  );
}





