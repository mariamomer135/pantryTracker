'use client';

import Image from "next/image";
import { useState, useEffect, useRef } from 'react';
import { firestore } from '@/firebase';
import { Box, Modal, Typography, Stack, TextField, Button } from '@mui/material';
import { collection, deleteDoc, doc, getDocs, query, getDoc, setDoc } from 'firebase/firestore';
import WelcomePage from './WelcomePage'; // Adjust the path according to your project structure

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [filteredInventory, setFilteredInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showWelcome, setShowWelcome] = useState(true);

  const containerRef = useRef(null); // Reference to the container

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
    setFilteredInventory(inventoryList);
    console.log(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity == 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }

    await updateInventory();
  };

  const addItems = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  useEffect(() => {
    // Update the height of the container whenever the filteredInventory changes
    if (containerRef.current) {
      containerRef.current.style.height = `${containerRef.current.scrollHeight}px`;
    }
  }, [filteredInventory]);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleSearch = (term) => {
    const filtered = inventory.filter(item => item.name.toLowerCase().includes(term.toLowerCase()));
    setFilteredInventory(filtered);
  };

  useEffect(() => {
    handleSearch(searchTerm);
  }, [searchTerm, inventory]);

  return (
    showWelcome ? (
      <WelcomePage onStart={() => setShowWelcome(false)} />
    ) : (
      <Box 
        width="100vw"
        height="100vh" 
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
      >
        <TextField
          variant="outlined"
          fullWidth
          placeholder="Search Items"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
          }}
          sx={{ marginTop: 2 }}
        />
        <Button 
          variant="contained" 
          onClick={handleOpen}
          sx={{ marginTop: 2, backgroundColor: '#F88379', '&:hover': { backgroundColor: '#D1FFBD' } }}
        >
          Add New Item
        </Button>
        <Modal open={open} onClose={handleClose}>
          <Box
            position="absolute" 
            top="50%" 
            left="50%" 
            width={400}
            bgcolor="white"
            border="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%, -50%)',
            }}
          > 
            <Typography variant="h6">Add Item</Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              /> 
              <Button
                variant="outlined"
                onClick={() => {
                  addItems(itemName);
                  setItemName('');
                  handleClose();
                }}
              >
                Add 
              </Button>
            </Stack>
          </Box>
        </Modal>
        <Box border="1px solid #333">
          <Box
            width="800px"
            height="100px"
            bgcolor="#FAB3AD"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <Typography variant="h2" color="#333">Inventory Items</Typography>
          </Box>
          <Box
            ref={containerRef} // Add ref to the container
            width="800px"
            bgcolor="#FFF"
            p={2}
            boxShadow={3}
            overflow="hidden" // Hide overflow
          >
            <Stack spacing={2}>
              {filteredInventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  width="100%"
                  minHeight="150px"
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  bgcolor="#fff"
                  padding={5}
                >
                  <Typography variant="h3" color="#333" textAlign="center">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant="h3" color="#333" textAlign="center">
                    {quantity}
                  </Typography>
                  <Stack direction="row" spacing={2}>
                    <Button 
                      variant="contained" 
                      onClick={() => addItems(name)}
                      sx={{ backgroundColor: '#F88379', '&:hover': { backgroundColor: '#D1FFBD' } }}
                    >
                      Add
                    </Button>
                    <Button 
                      variant="contained" 
                      onClick={() => removeItem(name)}
                      sx={{ backgroundColor: '#F88379', '&:hover': { backgroundColor: '#D1FFBD' } }}
                    >
                      Remove
                    </Button>
                  </Stack>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
      </Box>
    )
  );
}
