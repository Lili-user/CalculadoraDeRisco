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
  const [riskResult, setRiskResult] = useState(null); // Resultado do cálculo de risco
  const [calculatedData, setCalculatedData] = useState([]); // Dados calculados para envio

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
        title: "Sucesso",
        description: "Usuário deletado com sucesso.",
        duration: 2000,
        position: "top-center",
      });
    } catch (error) {
      toast({
        title: "Erro ao deletar usuário",
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

      // Adiciona os dados calculados ao estado
      setCalculatedData((prev) => [
        ...prev,
        {
          id: user.id,
          nome: user.nome,
          idade: user.idade,
          expressao: user.expressao,
          classe_risco: data.classe_risco,
          mensagem: data.mensagem,
        },
      ]);
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

  const handleSendCalculatedData = async () => {
    try {
      if (calculatedData.length === 0) {
        toast({
          title: "Nenhum dado para enviar",
          description: "Calcule o risco antes de enviar os dados.",
          status: "warning",
          duration: 3000,
          isClosable: true,
          position: "top",
        });
        return;
      }

      // Envia os dados calculados ao banco de dados
      const res = await fetch(BASE_URL + "/usuarios/atualizar-dados", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(calculatedData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Erro ao enviar os dados.");
      }

      toast({
        title: "Dados enviados com sucesso!",
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top",
      });

      // Limpa o estado dos dados calculados
      setCalculatedData([]);
    } catch (error) {
      toast({
        title: "Erro ao enviar os dados",
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
              aria-label="Excluir usuário"
              icon={<BiTrash size={20} />}
              onClick={handleDeleteUser}
            />
          </Flex>
        </Flex>
      </CardHeader>

      <CardBody bg={useColorModeValue("pink.100", "pink.500")}>
        <Button colorScheme="blue" onClick={handleCalculateRisk}>
          Calcular Expressão
        </Button>
        {riskResult && (
          <Box mt={4}>
            <Text>
              <strong>Classe de Risco:</strong> {riskResult.classe_risco}
            </Text>
            <Text>
              <strong>Mensagem:</strong> {riskResult.mensagem}
            </Text>
          </Box>
        )}
      </CardBody>
      
      <Box p={4} bg={useColorModeValue("pink.100", "pink.500")}>
        <Button
          bg={useColorModeValue("pink.100", "pink.500")}
          onClick={handleSendCalculatedData}
          isDisabled={calculatedData.length === 0} // Desabilita o botão se não houver dados calculados
        >
          Enviar Dados Calculados
        </Button>
      </Box>
    </Card>
  );
};

export default UserCard;
