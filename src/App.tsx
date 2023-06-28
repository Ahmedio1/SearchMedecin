import React, { ChangeEvent, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import BD from './BD/Api';
import Physician from './Models/Physician';
import { Table, TableHead, TableRow, TableCell, TableBody, Button, Chip, ListItemText, ListItem, List, Input, Alert, Dialog } from '@mui/material';
import { text } from 'stream/consumers';

function App() {
  const [searchTerm, setSearchTerm] = useState(''); // Search term
  const [searchResults, setSearchResults] = useState<Physician[]>([]); // Search results
  const [physicianList, setPhysicianList] = useState<Physician[]>([]); // List of physician
  const [specialteList, setSpecialteList] = useState<string[]>([]); // List of specialite
  const [physicianListOriginal, setListPhysicianOriginal] = useState<Physician[]>([]); // List of physician Original
  const [filledSpecialite, setFilledSpecialite] = useState<string>(''); // Specialite filled

  // permet de faire la recherche
  const inputChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
  };

  const performSearch = async (value: string) => {
    const bdInstance = new BD();
    const physicians = await bdInstance.getPhysician(value);
    setSearchResults(physicians);
  };

  // ajoute dans les listes les medecins et les specialites si et seulement si ils ne sont pas déjà présent
  const addList = (physician: Physician) => {
    if (physicianListOriginal.find((p) => p.identifiantpp === physician.identifiantpp)) {
      return;
    }
    setListPhysicianOriginal([...physicianListOriginal, physician]);
    if(filledSpecialite !== '' && physician.libellesavoirfaire === filledSpecialite){
      setPhysicianList([...physicianList, physician]);
    }

    if (specialteList.find((s) => s === physician.libellesavoirfaire) || physician.libellesavoirfaire == null) {
      return;
    }
    setSpecialteList([...specialteList, physician.libellesavoirfaire]);
  };

  // supprime un medecin de la liste
  // supprime une spécialité des chips si aucun médecin n'a cette spécialité
  const removeList = (physician: Physician) => {
    const confirmed = window.confirm('Voulez-vous supprimer ce médecin ?');
    if (confirmed) {
      setPhysicianList(physicianList.filter((p) => p.identifiantpp !== physician.identifiantpp));
      setListPhysicianOriginal(physicianListOriginal.filter((p) => p.identifiantpp !== physician.identifiantpp));
      if (physicianListOriginal.find((p) => p.libellesavoirfaire === physician.libellesavoirfaire && p.identifiantpp !== physician.identifiantpp)) {
        return;
      }
      setSpecialteList(specialteList.filter((s) => s !== physician.libellesavoirfaire));
    };
  };

  // permet de trier les medecins par specialite
  const trierSpecialite = (specialite: string) => {
    if (specialite === filledSpecialite) {
      setFilledSpecialite('');
      setPhysicianList(physicianListOriginal);
      return;
    }
    const filteredList = physicianListOriginal.filter((p) => p.libellesavoirfaire === specialite);
    setPhysicianList(filteredList);
    setFilledSpecialite(specialite);
  };


  return (
    <div className="App">
      <Input
        type="text"
        value={searchTerm}
        onChange={inputChange}
        placeholder="Recherche"
      />
      <List>
        {searchResults.map((physician, index) => (
          <ListItemText primary={physician.nomdexercice} onClick={() => addList(physician)} key={index} />
        ))}
      </List>
      {specialteList.map((specialite) => (
        <Chip
          onClick={() => trierSpecialite(specialite)}
          label={specialite}
          variant={filledSpecialite === specialite ? 'filled' : 'outlined'}
          color="secondary"
          key={specialite}
        />
      ))}
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nom</TableCell>
            <TableCell>Prénom</TableCell>
            <TableCell>Numero RPPS</TableCell>
            <TableCell>Spécialité Médecin</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {filledSpecialite === '' ? (
            physicianListOriginal.map((physician, index) => (
              <TableRow key={index}>
                <TableCell>{physician.nomdexercice}</TableCell>
                <TableCell>{physician.prenomdexercice}</TableCell>
                <TableCell>{physician.identifiantpp}</TableCell>
                <TableCell>{physician.libellesavoirfaire}</TableCell>
                <TableCell>
                  <Button onClick={() => {
                    removeList(physician);
                  }}>Supprimer</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            physicianList.map((physician, index) => (
              <TableRow key={index}>
                <TableCell>{physician.nomdexercice}</TableCell>
                <TableCell>{physician.prenomdexercice}</TableCell>
                <TableCell>{physician.identifiantpp}</TableCell>
                <TableCell>{physician.libellesavoirfaire}</TableCell>
                <TableCell>
                  <Button onClick={() => {
                    removeList(physician);
                  }}>Supprimer</Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export default App;
