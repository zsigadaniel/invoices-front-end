import { Button, Flex, Input, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useMutation } from "react-query";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setToken } from "../state/invoice/authSlice";

const baseUrl = "http://localhost:3000";

function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate } = useSignIn(setError);
  return (
    <Flex
      direction="column"
      justifyContent="center"
      alignItems="center"
      pt={20}
    >
      <form>
        <Input
          placeholder="username"
          mb={2}
          onChange={(e) => setUsername(e.target.value)}
        />
        <Input
          placeholder="Password"
          mb={2}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          w="full"
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            mutate({ username, password });
          }}
        >
          Login
        </Button>
      </form>
      {error && (
        <Text color="red" pt={3}>
          {error}
        </Text>
      )}
    </Flex>
  );
}

export default SignIn;

type Credentials = {
  username: string;
  password: string;
};

function useSignIn(setError: (error: string) => void) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  return useMutation(async (user: Credentials) => {
    const response = await fetch(`${baseUrl}/auth/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(user),
    });

    if (!response.ok) {
      setError(response.statusText);
      throw new Error("Invalid credentials");
    }

    const data = await response.json();

    if (data.accessToken) {
      localStorage.setItem("token", data.accessToken);
      dispatch(setToken(data.accessToken));
      navigate("/invoices");
    }

    return data;
  });
}
