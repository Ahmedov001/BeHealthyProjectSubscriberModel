import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Form, FormGroup, Label, Input, Button, Row, Col, Card, CardBody
} from 'reactstrap';
import { Snackbar, Alert } from '@mui/material';

const mealTypes = ["Breakfast", "Lunch", "Dinner", "Snack"];
const unitOptions = ["gram", "ml", "piece", "slice", "cup"];

const CreateProgramPage = () => {
    const [goal, setGoal] = useState('');
    const [meals, setMeals] = useState([
        { mealType: 'Breakfast', items: [{ name: '', quantity: 0, unit: 'gram' }] }
    ]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');

    const token = sessionStorage.getItem('token');
    const navigate = useNavigate()

    const handleMealTypeChange = (index, value) => {
        const updated = [...meals];
        updated[index].mealType = value;
        setMeals(updated);
    };

    const handleItemChange = (mealIndex, itemIndex, field, value) => {
        const updated = [...meals];
        updated[mealIndex].items[itemIndex][field] = value;
        setMeals(updated);
    };

    const addMeal = () => {
        setMeals([...meals, { mealType: 'Snack', items: [{ name: '', quantity: 0, unit: 'gram' }] }]);
    };

    const addItem = (mealIndex) => {
        const updated = [...meals];
        updated[mealIndex].items.push({ name: '', quantity: 0, unit: 'gram' });
        setMeals(updated);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();



        const response = await fetch('https://localhost:7148/api/Dietitian/create-diet-program', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ goal, meals })
        });

        if (response.ok) {
            setGoal('');
            setMeals([{ mealType: 'Breakfast', items: [{ name: '', quantity: 0, unit: 'gram' }] }]);
            setSnackbarMessage('Diet program created successfully!');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setTimeout(() => {
                navigate("/dietitianpage");
            }, 1500);


        } else {
            setSnackbarMessage('Invalid credentials.');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    return (
        <Form onSubmit={handleSubmit} className="p-4 ">
            <FormGroup>
                <Label for="goal">Goal</Label>
                <Input
                    id="goal"
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="e.g. Weight Loss"
                />
            </FormGroup>

            {meals.map((meal, i) => (
                <Card className="mb-3" key={i}>
                    <CardBody>
                        <FormGroup>
                            <Label>Meal Type</Label>
                            <Input
                                type="select"
                                value={meal.mealType}
                                onChange={(e) => handleMealTypeChange(i, e.target.value)}
                            >
                                {mealTypes.map(type => <option key={type}>{type}</option>)}
                            </Input>
                        </FormGroup>

                        {meal.items.map((item, j) => (
                            <Row key={j} className="align-items-end mb-2">
                                <Col md={5}>
                                    <FormGroup>
                                        <Label>Food Name</Label>
                                        <Input
                                            type="text"
                                            value={item.name}
                                            onChange={(e) => handleItemChange(i, j, 'name', e.target.value)}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Quantity</Label>
                                        <Input
                                            type="number"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(i, j, 'quantity', parseInt(e.target.value))}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={3}>
                                    <FormGroup>
                                        <Label>Unit</Label>
                                        <Input
                                            type="select"
                                            value={item.unit}
                                            onChange={(e) => handleItemChange(i, j, 'unit', e.target.value)}
                                        >
                                            {unitOptions.map(unit => <option key={unit}>{unit}</option>)}
                                        </Input>
                                    </FormGroup>
                                </Col>
                            </Row>
                        ))}

                        <Button color="secondary" size="sm" onClick={() => addItem(i)}>+ Add Food</Button>
                    </CardBody>
                </Card>
            ))}

            <Button color="info" onClick={addMeal} className="mb-3">+ Add Meal</Button><br />
            <Button color="primary" type="submit">Submit Program</Button>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{
                        width: '100%',
                        fontSize: '1.25rem',
                        padding: '16px',
                        textAlign: 'center',
                    }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Form>

    );
};

export default CreateProgramPage;
