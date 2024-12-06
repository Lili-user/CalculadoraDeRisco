import { Button, Flex, FormControl, FormLabel, Input, Modal, ModalBody,
	ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useColorModeValue, useDisclosure, 
	useToast} from "@chakra-ui/react";
import { useState } from "react";
import { BiAddToQueue} from "react-icons/bi";
import { BASE_URL } from "../constants";



const CreateUserModal = ({ setUsers }) => {
   const {isOpen, onOpen, onClose} = useDisclosure()
   const [isLoading, setIsLoading] = useState(false);
   const [inputs, setInputs] = useState({

	nome: "",
	idade: "",
	expressao: "",
})

const toast = useToast()

const handleCreateUser = async (e) => {
	e.preventDefault(); // prevent page refresh
	setIsLoading(true);
	try {
		const res = await fetch(BASE_URL + "/usuarios", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(inputs),
		});

		const data = await res.json();
		if (!res.ok) {
			throw new Error(data.error);
		}

		toast({
			status: "success",
			title: "Yayy! 🎉",
			description: "Friend created successfully.",
			duration: 2000,
			position: "top-center",
		});
		onClose();
		setUsers((prevUsers) => [...prevUsers, data]);

		setInputs({
			nome: "",
			idade: "",
			expressao: "",
		});
	} catch (error) {
		toast({
			status: "error",
			title: "An error occurred.",
			description: error.message,
			duration: 4000,
		});
	} finally {
		setIsLoading(false);
	}
   };

   return <>
	<Button onClick={onOpen}>
		<BiAddToQueue size={20}/>
	</Button>

	<Modal
		isOpen={isOpen}
		onClose={onClose}
	>
		<ModalOverlay />
		<form onSubmit={handleCreateUser}>
		<ModalContent  bg={useColorModeValue("pink.300", "pink.400")}>
			<ModalHeader> Adicionar usuário</ModalHeader>
			<ModalCloseButton/>

			<ModalBody pb={5}>
				<Flex alignItems={"center"} gap={3}>
					<FormControl>
						<FormLabel>Nome</FormLabel>
						<Input placeholder="Nome completo aqui " 
						value={inputs.nome}
						onChange={(e) => setInputs({...inputs, nome: e.target.value})}
						/>
					</FormControl> 
				</Flex>
					<FormControl alignItems={"center"} gap={3}>
						<FormLabel>Idade</FormLabel>
						<Input placeholder="Idade aqui "
						value={inputs.idade}
						onChange={(e) => setInputs({...inputs, idade: e.target.value})}
						/>
					</FormControl>

					<FormControl alignItems={"center"} gap={3}>
						<FormLabel>Expressão</FormLabel>
						<Input placeholder="Expressão aqui "
						value={inputs.expressao}
						onChange={(e) => setInputs({...inputs, expressao: e.target.value})}
						/>
					</FormControl>
			</ModalBody>

			<ModalFooter>
				<Button colorScheme='pink' color={'blank'} mr={5} type='submit'
					isLoading={isLoading}
				>
					Adicionar
				</Button>
				<Button onClick={onClose}>Cancelar</Button>
			</ModalFooter>

		</ModalContent>
		</form>

	</Modal>
   
   </>
   }

export default CreateUserModal;