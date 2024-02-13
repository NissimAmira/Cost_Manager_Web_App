import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { idb } from './idb';

export function AddCostForm() {
    const [cost, setCost] = useState({
        sum: '',
        category: 'FOOD',
        description: '',
        date: '', // Add date to the initial state
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { sum, category, description, date } = cost;
        try {
            await idb.openCostsDB('costsdb', 1);
            const result = await idb.addCost({
                sum: parseFloat(sum), // Ensure sum is stored as a number
                category,
                description,
                date, // Include date when adding a cost
            });
            if (result) {
                alert('Cost added successfully');
                setCost({ sum: '', category: 'FOOD', description: '', date: '' }); // Reset form
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
        <Form onSubmit={handleSubmit}>
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
            <Button variant="primary" type="submit">
                Add Cost
            </Button>
        </Form>
    );
}
