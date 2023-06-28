import React, { ChangeEvent, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import BD from './BD/Api';
import Physician from './Models/Physician';



function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Physician[]>([]);
  const [physicianList, setPhysicianList] = useState<Physician[]>([]);

 
  const inputChange = (event:ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    performSearch(event.target.value);
  };

  const performSearch = async (value: string) => {
    const bdInstance = new BD();
    const physicians = await bdInstance.getPhysician(value);
    setSearchResults(physicians);
  };

  const addList = (physician: Physician) => {
    if (physicianList.find((p) => p.identifiantpp === physician.identifiantpp)) {
      return;
    }
    console.log(physician);
    setPhysicianList([...physicianList, physician]);
  };

  const removeList = (physician: Physician) => {
    setPhysicianList(physicianList.filter((p) => p.identifiantpp !== physician.identifiantpp));
  };

  return (
    <div className="App">
      <input type="text"
        value={searchTerm}
        onChange={inputChange}
        placeholder="Recherche" ></input>
        <ul>
        {searchResults.map((physician,index) => (
          <li onClick={() => addList(physician)} key={index}>{physician.nomdexercice}</li>
        ))}
        </ul>

        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prénom</th>
              <th>Numero RPPS</th>
              <th>Spécialité Medecin</th>
            </tr>
          </thead>
          <tbody>
            {physicianList.map((physician,index) => (
              <tr key={index}>
                <td>{physician.nomdexercice}</td>
                <td>{physician.prenomdexercice}</td>
                <td>{physician.identifiantpp}</td>
                <td>{physician.libellesavoirfaire}</td>
                <td><button onClick={() => removeList(physician)}>Supprimer</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
  );
}

export default App;
