//Nissim Amira 307831388
//Yarin Ben-Moshe 314939885

import React from 'react';
import { Container } from 'react-bootstrap';
import { AddCostForm } from './add_cost_form';
import { CostReport } from './cost_report';
import './app.css';

function App() {
    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Cost Manager Web App</h1>
            <h3 className="text-center mb-4">By Nissim Amira & Yarin Ben Moshe</h3>
            <AddCostForm />
            <CostReport />
        </Container>
    );
}

export default App;
