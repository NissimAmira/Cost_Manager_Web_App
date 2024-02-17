//Nissim Amira 307831388
//Yarin Ben-Moshe 314939885

import React, { useState, useEffect } from 'react';
import {Form, Table, Row, Col, Card, Button} from 'react-bootstrap';
import { idb } from './idb';

export function CostReport() {
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [year, setYear] = useState(new Date().getFullYear());
    const [costs, setCosts] = useState([]);

    const fetchCosts = async () => {
        await idb.openCostsDB('costsdb', 1);
        const fetchedCosts = await idb.getCostsByMonthYear(month, year);
        setCosts(fetchedCosts);
    };

    useEffect(() => {
        fetchCosts().catch(console.error);
    })

    const handleDelete = async (id) => {
        await idb.deleteCostById(id);
        await fetchCosts(); // Refresh the list after deletion
    };

    return (
        <Card>
            <Card.Header className="text-center">Fetch Cost Report</Card.Header>
            <Card.Body>
                <Form>
                    <Row className="justify-content-md-center mb-4">
                        <Col md={6} lg={3}>
                            <Form.Group controlId="monthSelect">
                                <Form.Label>Select Month</Form.Label>
                                <Form.Control as="select" value={month} onChange={e => setMonth(parseInt(e.target.value, 10))}>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i + 1} value={i + 1}>{i + 1}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col md={6} lg={3}>
                            <Form.Group controlId="yearSelect">
                                <Form.Label>Select Year</Form.Label>
                                <Form.Control as="select" value={year} onChange={e => setYear(parseInt(e.target.value, 10))}>
                                    {Array.from({ length: 10 }, (_, i) => (
                                        <option key={i} value={new Date().getFullYear() - i}>{new Date().getFullYear() - i}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
                <Table striped bordered hover className="mt-4">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Sum</th>
                        <th>Category</th>
                        <th>Description</th>
                        <th>Delete?</th>
                    </tr>
                    </thead>
                    <tbody>
                    {costs.map((cost, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{cost.date}</td>
                            <td>{cost.sum}</td>
                            <td>{cost.category}</td>
                            <td>{cost.description}</td>
                            <td>
                                <Button variant="danger" onClick={() => handleDelete(cost.id)}>Delete</Button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>

    );
}
