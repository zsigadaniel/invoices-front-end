import {
  Box,
  Button,
  Checkbox,
  Flex,
  IconButton,
  Input,
  ListItem,
  Menu,
  MenuButton,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  UnorderedList,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import { BiUser } from "react-icons/bi";
import { BsBell } from "react-icons/bs";
import { CgDarkMode } from "react-icons/cg";
import { RxHamburgerMenu } from "react-icons/rx";
import { SlSettings } from "react-icons/sl";
import { useQuery } from "react-query";
import { NavLink, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../state/store";
import { setInvoice, setInvoices } from "../state/invoice/invoiceSlice";
import { useEffect, useState } from "react";

type Invoice = {
  id: string;
  vendor_name: string;
  amount: number;
  due_date: string;
  description: string;
  paid: boolean;
  createdAt: string;
};

const baseUrl = "http://localhost:3000";

function Invoices() {
  const invoices = useSelector((state: RootState) => state.invoice.invoices);
  const invoice = useSelector((state: RootState) => state.invoice.invoice);
  const token = useSelector((state: RootState) => state.auth.token);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    if (!token) {
      navigate("/signin");
    }
  }, [token]);

  const data = useQuery("invoices", async () => {
    const response = await fetch(`${baseUrl}/invoices`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      setError(response.statusText);
      throw new Error("Network response was not ok");
    }

    const invoicesResponse = await response.json();
    dispatch(setInvoices(invoicesResponse));
    return invoicesResponse;
  });

  const getInvoiceById = async (id: string) => {
    const response = await fetch(`${baseUrl}/invoices/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      setError(response.statusText);
      throw new Error("Network response was not ok");
    }

    const invoice = await response.json();
    dispatch(setInvoice(invoice));
  };

  if (invoices.length === 0) {
    return <Text>No invoices</Text>;
  }

  if (error) {
    return <Text color="red">Error</Text>;
  }

  if (data.isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <Flex bg="lightblue" h="100vh">
      <VStack w="300px" bg="lightblue" pt={10}>
        <VStack justifyContent="start" alignItems="start" mb={6}>
          <Flex
            w="180px"
            h="60px"
            bg="white"
            rounded={8}
            justifyContent="center"
            alignItems="center"
            fontWeight="bold"
            color="gray.500"
            fontSize="large"
          >
            LOGO
          </Flex>
          <Text>Menu</Text>
        </VStack>
        <UnorderedList
          listStyleType="none"
          display="flex"
          flexDirection="column"
          gap={3}
          w="150px"
        >
          <ListItem>
            <NavLink
              to="/"
              style={({ isActive }) => {
                return {
                  fontWeight: isActive ? "bold" : "normal",
                };
              }}
            >
              Home
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink
              to="/invoices"
              style={({ isActive }) => {
                return {
                  fontWeight: isActive ? "bold" : "normal",
                };
              }}
            >
              Invoices
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink
              to="/bills"
              style={({ isActive }) => {
                return {
                  fontWeight: isActive ? "bold" : "normal",
                };
              }}
            >
              Bills
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink
              to="/expenses"
              style={({ isActive }) => {
                return {
                  fontWeight: isActive ? "bold" : "normal",
                };
              }}
            >
              Expenses
            </NavLink>
          </ListItem>
          <ListItem>
            <NavLink
              to="/reports"
              style={({ isActive }) => {
                return {
                  fontWeight: isActive ? "bold" : "normal",
                };
              }}
            >
              Reports
            </NavLink>
          </ListItem>
        </UnorderedList>
      </VStack>
      <Box w="full" rounded={20} bg="white" px={20} pt={10}>
        <Flex justifyContent="space-between">
          <Flex justifyContent="center" alignItems="center" gap={4}>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label="Options"
                icon={<RxHamburgerMenu />}
                variant="outline"
              />
              <MenuList></MenuList>
            </Menu>
            <Flex gap={2}>
              <Text>Home</Text> /<Text fontWeight="bold">Invoices</Text>
            </Flex>
          </Flex>
          <Flex gap={18} justifyContent="center" alignItems="center">
            <Input placeholder="Search" />
            <BsBell size="25px" />
            <SlSettings size="25px" />
            <CgDarkMode size="25px" />
            <BiUser size="30px" />
          </Flex>
        </Flex>

        <TableContainer w="80%" pt={10}>
          <Table variant="simple">
            <Thead bg="lightblue">
              <Tr>
                <Th>
                  <Checkbox />
                </Th>
                <Th>Date</Th>
                <Th>Payee</Th>
                <Th>Description</Th>
                <Th>Due</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices?.map((invoice: Invoice) => (
                <Tr
                  key={invoice.id}
                  cursor="pointer"
                  onClick={() => {
                    getInvoiceById(invoice.id);
                    onOpen();
                  }}
                >
                  <Th>
                    <Checkbox />
                  </Th>
                  <Td>{format(invoice.createdAt, "MM/dd/yyyy")}</Td>
                  <Td>{invoice.vendor_name}</Td>
                  <Td>{invoice.description}</Td>
                  <Td>{format(invoice.due_date, "MM/dd/yyyy")}</Td>
                  <Td>$ {invoice.amount}</Td>
                  <Td>{invoice.paid ? "Paid" : "Open"}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {invoice && (
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{invoice?.vendor_name}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Text>Description: {invoice?.description}</Text>
                <Text>Amount: {invoice?.amount}</Text>
                <Text>
                  Due Date: {format(invoice?.due_date as string, "MM/dd/yyyy")}
                </Text>
                <Text>Status: {invoice?.paid ? "Paid" : "Open"}</Text>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="blue" mr={3} onClick={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        )}
      </Box>
    </Flex>
  );
}

export default Invoices;
