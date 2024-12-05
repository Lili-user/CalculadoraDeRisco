import { 
    Card, 
    CardHeader, 
    Flex, 
    Heading, 
    Box, 
    Text, 
    IconButton, 
    useColorModeValue, 
    CardBody, 
    Button, 
    useToast 
  } from "@chakra-ui/react";
  import { BiTrash } from "react-icons/bi";
  import EditModal from "./EditModal";
  import { BASE_URL } from "../constants";
  import { useState } from "react";
  
  const UserCard = ({ user, setUsers }) => {
    const toast = useToast();
    const [riskResult, setRiskResult] = useState(null); // Estado para armazenar o resultado do cálculo
  
    const handleDeleteUser = async () => {
      try {
        const res = await fetch(BASE_URL + "/usuarios/" + user.id, {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error);
        }
        setUsers((prevUsers) => prevUsers.filter((u) => u.id !== user.id));
        toast({
          status: "success",
          title: "Success",
          description: "Usuário deletado com sucesso.",
          duration: 2000,
          position: "top-center",
        });
      } catch (error) {
        toast({
          title: "Aconteceu um erro.",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top-center",
        });
      }
    };
  
    const handleCalculateRisk = async () => {
      try {
        const res = await fetch(BASE_URL + "/calcular", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            expressao: user.expressao,
            idade: user.idade,
          }),
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || "Erro ao calcular o risco.");
        }
  
        setRiskResult({
          classe_risco: data.classe_risco,
          mensagem: data.mensagem,
        });
      } catch (error) {
        toast({
          title: "Erro ao calcular risco",
          description: error.message,
          status: "error",
          duration: 4000,
          isClosable: true,
          position: "top",
        });
      }
    };
  
    return (
      <Card>
        <CardHeader bg={useColorModeValue("pink.300", "pink.500")}>
          <Flex gap={4}>
            <Flex flex={"1"} gap={4} alignItems={"center"}>
              <Box>
                <Heading size="sm">{user.nome}</Heading>
                <Text>Idade: {user.idade}</Text>
                <Text>Expressão: {user.expressao}</Text>
              </Box>
            </Flex>
  
            <Flex>
              <EditModal user={user} setUsers={setUsers} />
              <IconButton
                variant="ghost"
                colorScheme="red"
                size={"sm"}
                aria-label="Ver menu"
                icon={<BiTrash size={20} />}
                onClick={handleDeleteUser}
              />
            </Flex>
          </Flex>
        </CardHeader>
  
        <CardBody bg={useColorModeValue("pink.300", "pink.500")}>
          <Button colorScheme="blue" onClick={handleCalculateRisk}>
            Calcular Expressão
          </Button>
          {riskResult && (
            <Box mt={4}>
              <Text><strong>Classe de Risco:</strong> {riskResult.classe_risco}</Text>
              <Text><strong>Mensagem:</strong> {riskResult.mensagem}</Text>
            </Box>
          )}
        </CardBody>
      </Card>
    );
  };
  
  export default UserCard;
  