import React from 'react';
import { Container } from 'react-bootstrap';
import { AddCostForm } from './AddCostForm';
import { CostReport } from './CostReport';

function App() {
    return (
        <Container className="my-5">
            <h1 className="text-center mb-4">Cost Manager Web App</h1>
            <h3 className="text-center mb-4">By Nissim Amira & Yarin Cohen</h3>
            <AddCostForm />
            <CostReport />
        </Container>
    );
}

export default App;
