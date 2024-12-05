import {
	Button,
	Flex,
	FormControl,
	FormLabel,
	IconButton,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	useDisclosure,
	useToast,
    useColorModeValue,
} from "@chakra-ui/react";
import { BiEditAlt } from "react-icons/bi";
import { BASE_URL } from "../constants";
import { useState } from "react";

function EditModal({setUsers, user}) {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [isLoading, setIsLoading] = useState(false);
	const [inputs, setInputs] = useState({
		nome: user.nome,
		idade: user.idade,
		expressao: user.expressao,
	});
	const toast = useToast();

	const handleEditUser = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		try {
			const res = await fetch(BASE_URL + "/usuarios/" + user.id, {
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(inputs),
			});
			const data = await res.json();
			if (!res.ok) {
				throw new Error(data.error);
			}
			setUsers((prevUsers) => prevUsers.map((u) => (u.id === user.id ? data : u)));
			toast({
				status: "success",
				title: "Yayy! 🎉",
				description: "Usuário atualizado.",
				duration: 2000,
				position: "top-center",
			});
			onClose();
		} catch (error) {
			toast({
				status: "error",
				title: "Aconteceu um erro.",
				description: error.message,
				duration: 4000,
				position: "top-center",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<>
			<IconButton
				onClick={onOpen}
				variant='ghost'
				colorScheme='blue'
				aria-label='Ver Menu'
				size={"sm"}
				icon={<BiEditAlt size={20} />}
			/>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<form onSubmit={handleEditUser}>
					<ModalContent bg={useColorModeValue("pink.300", "pink.500")}>
						<ModalHeader>Novo Usuário</ModalHeader>
						<ModalCloseButton />
						<ModalBody pb={6} bg={useColorModeValue("pink.300", "pink.500")}>
							<Flex alignItems={"center"} gap={4} >
								<FormControl>
									<FormLabel>Nome</FormLabel>
									<Input
										placeholder='Nome aqui'
										value={inputs.nome}
										onChange={(e) => setInputs((prev) => ({ ...prev, nome: e.target.value }))}
									/>
								</FormControl>

								<FormControl>
									<FormLabel>Idade</FormLabel>
									<Input
										placeholder='Idade aqui'
										value={inputs.idade}
										onChange={(e) => setInputs((prev) => ({ ...prev, idade: e.target.value }))}
									/>
								</FormControl>

                                <FormControl>
									<FormLabel>Expressão</FormLabel>
									<Input
										placeholder='Expressão aqui'
										value={inputs.expressao}
										onChange={(e) => setInputs((prev) => ({ ...prev, expressao: e.target.value }))}
									/>
								</FormControl>
							</Flex>
						</ModalBody>

						<ModalFooter>
							<Button colorScheme='blue' mr={3} type='submit' isLoading={isLoading}>
								Atualizar 
							</Button>
							<Button onClick={onClose}>Cancelar</Button>
						</ModalFooter>
					</ModalContent>
				</form>
			</Modal>
		</>
	);
}

export default EditModal;