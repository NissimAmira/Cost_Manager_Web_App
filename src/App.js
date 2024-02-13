import React from 'react';
import { Container } from 'react-bootstrap';
import { AddCostForm } from './AddCostForm';
import { CostReport } from './CostReport';

function App() {
    return (
        <Container>
            <h1>Cost Manager</h1>
            <AddCostForm />
            <CostReport />
        </Container>
    );
}

export default App;
