import { Container, Stack, useColorModeValue } from '@chakra-ui/react';
import Navbar from "./components/Navbar"
import UserGrid from './components/UserGrid';
import { useState } from 'react';

import { BASE_URL } from "./constants";

function App() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch(`${BASE_URL}/usuarios`);
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Erro ao buscar os usuários");
      }
    } catch (error) {
      console.error("Erro ao conectar à API:", error);
    }
  };

  return (
    <Stack minH={"100vh"} bg={useColorModeValue("pink.200", "pink.400")}>
      <Navbar setUsers={setUsers} fetchUsers={fetchUsers} /> {/* Passando fetchUsers como prop */}
      <Container maxW={"1200px"} my={4}>
        <UserGrid users={users} setUsers={setUsers} />
      </Container>
    </Stack>
  );
}

export default App;
