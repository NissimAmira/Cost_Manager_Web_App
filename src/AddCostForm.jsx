//Nissim Amira 307831388
//Yarin Ben-Moshe 314939885
import React, { useState } from 'react';
import { Form, Button, Row, Col, Card } from 'react-bootstrap';
import { idb } from './idb';
import './AddCostForm.css';

export function AddCostForm() {
    const [cost, setCost] = useState({
        sum: '',
        category: 'FOOD',
        description: '',
        date: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { sum, category, description, date } = cost;
        try {
            await idb.openCostsDB('costsDB', 1);
            const result = await idb.addCost({
                sum: parseFloat(sum),
                category,
                description,
                date,
            });
            if (result) {
                // alert('Cost added successfully');
                setCost({ sum: '', category: 'Food', description: '', date: '' }); // Reset form
            }
        } catch (error) {
            alert('Failed to add cost');
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCost((prevCost) => ({ ...prevCost, [name]: value }));
    };

    return (
        <Card className="mb-5">
            <Card.Header className="text-center">Add New Cost</Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit} className="mb-5">
                    <Row className="justify-content-md-center">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Sum</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="sum"
                                    value={cost.sum}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Category</Form.Label>
                                <Form.Control
                                    as="select"
                                    name="category"
                                    value={cost.category}
                                    onChange={handleChange}
                                >
                                    <option>FOOD</option>
                                    <option>HEALTH</option>
                                    <option>EDUCATION</option>
                                    <option>TRAVEL</option>
                                    <option>HOUSING</option>
                                    <option>OTHER</option>
                                </Form.Control>
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="description"
                                    value={cost.description}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Date</Form.Label>
                                <Form.Control
                                    type="date"
                                    name="date"
                                    value={cost.date}
                                    onChange={handleChange}
                                    required
                                />
                            </Form.Group>
                            <div className="text-center" id="submitButtomDiv">
                                <Button variant="primary" type="submit">
                                    Add Cost
                                </Button>
                            </div>
                        </Col>
                    </Row>
                </Form>
            </Card.Body>
        </Card>

    );
}
