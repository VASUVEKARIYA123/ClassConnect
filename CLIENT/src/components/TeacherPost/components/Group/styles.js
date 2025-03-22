import styled from "styled-components";


// WRAPPER
export const Wrapper = styled.section`
  max-width: 55vw;
  min-height: 150px;
  background: snow;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-left: auto;
  margin-bottom: 20px;
  min-width: 10%;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.1);


  @media (max-width: 780px) {
    max-width: 90vw;
  }
`;


// LOADER
export const Loader = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #4e4e4e;
  padding: 20px;
`;


// HEADER STYLES
export const Header = styled.header`
  display: flex;
  width: 100%;
  padding: 20px;
  align-items: center;
`;


export const Avatar = styled.img`
  height: 50px;
  width: 50px;
  border-radius: 50%;
  border: 2px solid #007bff;
`;


export const Informations = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
`;


export const GroupName = styled.span`
  color: #242424;
  font-size: 1.2rem;
  font-weight: bold;
`;


export const GroupNumber = styled.span`
  font-size: 0.9rem;
  color: #555;
`;


export const DateOfCreation = styled.span`
  font-size: 0.8rem;
  color: #777;
`;


// DESCRIPTION
export const Description = styled.p`
  padding: 20px;
  text-align: justify;
  font-size: 0.9rem;
  width: 100%;
  color: #333;
`;


// GROUP MEMBERS
export const GroupMembers = styled.div`
  width: 100%;
  padding: 10px 20px;
  display: flex;
  // align-items: center;
  font-size: 1rem;
  font-weight: bold;
  color: #242424;
  background: #f3f3f3;
  border-radius: 6px;
  margin-top: 10px;
`;


// GROUP CODE
export const GroupCode = styled.div`
  width: 100%;
  padding: 10px 20px;
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  color: #242424;
  background: #f3f3f3;
  border-radius: 6px;
  margin-top: 10px;
`;


export const CopyButton = styled.button`
  margin-left: auto;
  padding: 5px 10px;
  font-size: 0.9rem;
  border: none;
  background: #007bff;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;


  &:hover {
    background: #0056b3;
  }
`;


// BUTTONS
export const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin-top: 20px;
`;


export const CreateGroupButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-bottom: 10px;
  width: 80%;


  &:hover {
    background: #0056b3;
  }


  &:disabled {
    background: gray;
    cursor: not-allowed;
  }
`;


export const JoinGroupButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  background: #28a745;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  width: 80%;


  &:hover {
    background: #218838;
  }
`;


// JOIN GROUP PAGE STYLES
export const Input = styled.input`
  width: 80%;
  padding: 10px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  margin: 10px 0;
`;


export const JoinButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
  width: 80%;


  &:hover {
    background: #0056b3;
  }
`;




export const Button = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
  width: 80%;


  &:hover {
    background: #0056b3;
  }
`;
export const BackButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  background: #dc3545;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
  width: 80%;


  &:hover {
    background: #c82333;
  }
`;


export const Message = styled.p`
  color: green;
  font-size: 1rem;
  margin-top: 10px;
`;


export const InputField = styled.input`
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  margin: 10px 0;
  outline: none;
  transition: border 0.3s ease;


  &:focus {
    border: 1px solid #007bff;
  }
`;


// BUTTON STYLES
export const ActionButton = styled.button`
  padding: 12px 18px;
  border: none;
  border-radius: 6px;
  background: #007bff;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;
  width: 85%;


  &:hover {
    background: #0056b3;
  }


  &:disabled {
    background: gray;
    cursor: not-allowed;
  }
`;


// FORM WRAPPER
export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
`;


export const ErrorMessage = styled.div`
  color: red;
  background-color: #ffe6e6;
  padding: 10px;
  border-radius: 5px;
  text-align: center;
  margin-top: 10px;
  font-weight: bold;
`;

