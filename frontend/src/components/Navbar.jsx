import {
    Box,
    Button,
    Container,
    Flex,
    Text,
    useColorMode,
    useColorModeValue,
  } from "@chakra-ui/react";
  import { IoMoon } from "react-icons/io5";
  import { LuSun } from "react-icons/lu";
  import CreateUserModal from "./CreateUserModal";
  import { saveAs } from "file-saver"; // Certifique-se de instalar: npm install file-saver
  
  const Navbar = ({ setUsers }) => {
    const { colorMode, toggleColorMode } = useColorMode();
  
    const handleDownloadDatabase = async () => {
      try {
        const response = await fetch("/api/exportar-planilha", {
          method: "GET", // Alterado para o método GET
        });
  
        if (!response.ok) {
          throw new Error("Erro ao baixar a planilha. Verifique o backend.");
        }
  
        const blob = await response.blob(); // Converte a resposta em blob
        saveAs(blob, "banco_de_dados.xlsx"); // Salva o arquivo localmente
      } catch (error) {
        console.error(error.message);
        alert("Erro ao tentar baixar a planilha. Tente novamente.");
      }
    };
  
    return (
      <Container maxW={"900px"}>
        <Box
          px={4}
          my={4}
          borderRadius={5}
          bg={useColorModeValue("pink.400", "pink.500")}
        >
          <Flex h="16" alignItems={"center"} justifyContent={"space-between"}>
            {/* Left Side */}
            <Flex
              alignItems={"center"}
              justifyContent={"center"}
              gap={3}
              display={{ base: "none", sm: "flex" }}
            ></Flex>
            {/* Right Side */}
            <Flex gap={3} alignItems={"center"}>
              <Text
                fontSize={"lg"}
                fontWeight={500}
                display={{ base: "none", md: "block" }}
              >
                Calculadora de Risco
              </Text>
  
              <Button onClick={toggleColorMode}>
                {colorMode === "light" ? <IoMoon /> : <LuSun size={20} />}
              </Button>
  
              <CreateUserModal setUsers={setUsers} />
  
              {/* Botão de Download */}
              <Button colorScheme="teal" onClick={handleDownloadDatabase}>
                Baixar Planilha
              </Button>
            </Flex>
          </Flex>
        </Box>
      </Container>
    );
  };
  
  export default Navbar;
  