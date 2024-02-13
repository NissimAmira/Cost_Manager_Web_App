import React, { useState, useEffect } from 'react';
import { Form, Table, Button } from 'react-bootstrap';
import { idb } from './idb';

export function CostReport() {
    const [month, setMonth] = useState(new Date().getMonth() + 1); // Default to current month
    const [year, setYear] = useState(new Date().getFullYear()); // Default to current year
    const [costs, setCosts] = useState([]);

    useEffect(() => {
        // Ensure the database is opened before trying to fetch costs
        const fetchCosts = async () => {
            await idb.openCostsDB('costsdb', 1);
            const fetchedCosts = await idb.getCostsByMonthYear(month, year);
            setCosts(fetchedCosts);
        };

        fetchCosts().catch(console.error);
    }, [month, year]);

    return (
        <div>
            <Form>
                <Form.Group controlId="monthSelect">
                    <Form.Label>Select Month</Form.Label>
                    <Form.Control as="select" value={month} onChange={e => setMonth(parseInt(e.target.value, 10))}>
                        {Array.from({ length: 12 }, (_, i) => (
                            <option key={i + 1} value={i + 1}>{i + 1}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Form.Group controlId="yearSelect">
                    <Form.Label>Select Year</Form.Label>
                    <Form.Control as="select" value={year} onChange={e => setYear(parseInt(e.target.value, 10))}>
                        {Array.from({ length: 10 }, (_, i) => (
                            <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                        ))}
                    </Form.Control>
                </Form.Group>
                <Button onClick={() => idb.getCostsByMonthYear(month, year).then(setCosts)}>Fetch Costs</Button>
            </Form>
            <Table striped bordered hover>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Sum</th>
                    <th>Category</th>
                    <th>Description</th>
                </tr>
                </thead>
                <tbody>
                {costs.map((cost, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{cost.sum}</td>
                        <td>{cost.category}</td>
                        <td>{cost.description}</td>
                    </tr>
                ))}
                </tbody>
            </Table>
        </div>
    );
}

