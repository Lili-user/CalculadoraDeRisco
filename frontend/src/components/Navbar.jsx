import { Box, Button, Container, Flex , Text, useColorMode, useColorModeValue} from "@chakra-ui/react"
import { IoMoon } from "react-icons/io5";
import { LuSun } from "react-icons/lu"
import CreateUserModal from "./CreateUserModal";
const Navbar = ({ setUsers }) => {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <Container maxW={"900px"}>
            <Box
                px={4}
                my={4}
                borderRadius={5}
                bg={useColorModeValue("pink.400", "pink.500")}
            >
                <Flex h="16"
                    alignItems={"center"}
                    justifyContent={"space-between"}
                >
                    {/*Left Side*/}
                    <Flex
                        alignItems={"center"}
                        justifyContent={"center"}
                        gap={3}
                        display={{base:"none", sm:"flex"}}
                    >
                    </Flex>
                    {/*Right Side*/}
                    <Flex gap={3} alignItems={"center"}>
                    <Text fontSize={"lg"} fontWeight={500} display={{base: "none", md: "block"}}>
                        Calculadora de Risco
                        </Text>

                        <Button onClick={toggleColorMode}>
                            {colorMode === "light" ? <IoMoon/> : <LuSun size={20}/>}
                        </Button>
                        <CreateUserModal setUsers={setUsers} />
                    </Flex>
                </Flex>
            </Box>

        </Container>
    );
};
export default Navbar

