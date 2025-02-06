/**
 * © Copyright IBM Corp. 2016, 2025 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

import './exerciser.css';
import './externalLibsComponent.css';
import {BrowserRouter, Routes, Route, useParams} from 'react-router';
import Exerciser from './Exerciser';

function Data({match}) {
  let params = useParams();
  return <Exerciser data={params ? params.id : null}/>
}

function App() {
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
    <div className="App">
        <main>
          <Routes>
            <Route path="/" element={<Data/>}/>
            <Route path="/:id" element={<Data/>}/>
          </Routes>
        </main>
    </div>
</BrowserRouter>
);
}

export default App;
