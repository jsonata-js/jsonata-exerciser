/**
 * © Copyright IBM Corp. 2020 All Rights Reserved
 *   Project name: JSONata
 *   This project is licensed under the MIT License, see LICENSE
 */

import React, {Component} from 'react';
import './exerciser.css';
import {BrowserRouter, Route} from 'react-router-dom';
import Exerciser from './Exerciser';
class App extends Component {

    loadData({match}) {
        return <Exerciser data={match ? match.params.id : null}/>
    }

    render() {
        return (
          <BrowserRouter basename={process.env.PUBLIC_URL}>
              <div className="App">
                  <main>
                      <Route path="/:id" children={this.loadData}/>
                  </main>
              </div>
          </BrowserRouter>
        );
    }
}

export default App;
