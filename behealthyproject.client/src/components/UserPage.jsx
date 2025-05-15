import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function UserPage() {
    const [foods, setFoods] = useState([]);
    const [selectedMeal, setSelectedMeal] = useState(null);
    const [mealFoods, setMealFoods] = useState({
        Breakfast: [],
        Lunch: [],
        Dinner: [],
        "Snacks/Other": []
    });

    const [totals, setTotals] = useState({
        calories: 0,
        fat: 0,
        carbs: 0,
        protein: 0,
        sugar: 0
    });

    const [selectedFoodOption, setSelectedFoodOption] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [recommendations, setRecommendations] = useState({
        dailyCalories: 0,
        waterMl: 0
    });

    const meals = [
        { name: "Breakfast", icon: "bi-sun-fill", color: "#fbc02d" },
        { name: "Lunch", icon: "bi-brightness-high-fill", color: "#03a9f4" },
        { name: "Dinner", icon: "bi-sunset-fill", color: "#ff8a65" },
        { name: "Snacks/Other", icon: "bi-moon-fill", color: "#ba68c8" },
    ];


    useEffect(() => {
        axios.get('https://localhost:7148/foods')
            .then(res => setFoods(res.data))
            .catch(err => console.error("Error loading foods:", err));
    }, []);


    useEffect(() => {
        const token = sessionStorage.getItem('token');

        axios.get('https://localhost:7148/api/User/get-profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                const { age, weight, height } = res.data;
                setUserProfile({ age, weight, height });

                const bmr = 66.47 + (13.75 * weight) + (5.003 * height) - (6.755 * age);
                const tdee = bmr * 1.2;
                const water = weight * 35;

                setRecommendations({
                    dailyCalories: Math.round(tdee),
                    waterMl: Math.round(water)
                });
            })
            .catch(err => console.error("Error loading user profile:", err));
    }, []);

    const updateTotals = (food, action = 'add') => {
        const factor = action === 'add' ? 1 : -1;
        setTotals(prev => ({
            calories: prev.calories + factor * (food.calories || 0),
            fat: prev.fat + factor * (food.fatTotalG || 0),
            carbs: prev.carbs + factor * (food.carbohydratesTotalG || 0),
            protein: prev.protein + factor * (food.proteinG || 0),
            sugar: prev.sugar + factor * (food.sugarG || 0),
        }));
    };

    const handleAddClick = (meal) => {
        setSelectedMeal(meal);
        setSelectedFoodOption(null);
    };

    const handleFoodSelect = (selectedOption) => {
        const selectedFood = selectedOption?.value;
        if (!selectedMeal || !selectedFood) return;

        setMealFoods(prev => ({
            ...prev,
            [selectedMeal]: [...prev[selectedMeal], selectedFood]
        }));

        updateTotals(selectedFood, 'add');
        setSelectedMeal(null);
        setSelectedFoodOption(null);
    };

    const handleRemoveFood = (mealName, index) => {
        const removedFood = mealFoods[mealName][index];

        setMealFoods(prev => ({
            ...prev,
            [mealName]: prev[mealName].filter((_, i) => i !== index)
        }));

        updateTotals(removedFood, 'remove');
    };

    const foodOptions = foods.map(food => ({
        value: food,
        label: `${food.name} (${food.calories} kcal)`
    }));

    return (
        <div style={{ backgroundColor: '#2f343d' }} className="min-vh-100 text-white p-4">
            <nav className="navbar navbar-expand navbar-dark mb-4" style={{ backgroundColor: '#1f232b' }}>
                <div className="container-fluid">
                    <a className="navbar-brand" href="/userpage">BeHealthy</a>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0 d-flex flex-row gap-3">
                        <li className="nav-item"><a className="nav-link active" href="/userpage">Home</a></li>
                        <li className="nav-item"><a className="nav-link" href="/userprofile">Profile</a></li>
                        <li className="nav-item"><a className="nav-link" href="#">Posts</a></li>
                        <li className="nav-item"><a className="nav-link" href="/dietitianslist">Dietitians</a></li>
                    </ul>
                </div>
            </nav>

            <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-1">
                    <h5 className="mb-0">FOOD DIARY</h5>
                    <div>
                        <small className="me-2">Calories</small>
                        <strong>{totals.calories.toFixed(0)}</strong>
                    </div>
                </div>
                <small>
                    Fat: {totals.fat.toFixed(1)}g, Carbs: {totals.carbs.toFixed(1)}g,
                    Protein: {totals.protein.toFixed(1)}g, Sugar: {totals.sugar.toFixed(1)}g
                </small>
            </div>

            {userProfile && (
                <div className="mb-4 p-4 rounded-4 shadow" style={{ backgroundColor: '#3a4049' }}>
                    <h4 className="mb-3 fw-bold text-info">🧠 Daily Recommendations</h4>
                    <p className="mb-1">
                        🔥 <strong>Suggested Calories:</strong> <span className="text-warning">{recommendations.dailyCalories} kcal</span>
                    </p>
                    <p className="mb-0">
                        💧 <strong>Water Intake:</strong> <span className="text-primary">{(recommendations.waterMl / 1000).toFixed(2)} L</span>
                    </p>
                </div>
            )}

        
            {meals.map((meal, index) => (
                <div
                    key={index}
                    className="d-flex flex-column p-3 rounded-3 mb-3"
                    style={{ backgroundColor: '#3a4049' }}
                >
                    <div className="d-flex align-items-center justify-content-between">
                        <div className="d-flex align-items-center">
                            <i className={`bi ${meal.icon} me-2`} style={{ color: meal.color, fontSize: '1.5rem' }}></i>
                            <span style={{ fontSize: '1.1rem' }}>{meal.name}</span>
                        </div>
                        <button
                            className="btn btn-link p-0 border-0"
                            onClick={() => handleAddClick(meal.name)}
                            style={{ color: '#00c853', fontSize: '1.5rem' }}
                        >
                            <i className="bi bi-plus-lg"></i>
                        </button>
                    </div>

                    <ul className="mt-2 mb-1 list-unstyled">
                        {mealFoods[meal.name].map((food, i) => (
                            <li key={i} className="d-flex justify-content-between align-items-center">
                                <span style={{ fontSize: '0.9rem' }}>
                                    {food.name} – {food.calories} kcal
                                </span>
                                <button
                                    className="btn btn-sm btn-outline-danger"
                                    onClick={() => handleRemoveFood(meal.name, i)}
                                >
                                    x
                                </button>
                            </li>
                        ))}
                    </ul>

                    {selectedMeal === meal.name && (
                        <div className="mt-2">
                            <Select
                                value={selectedFoodOption}
                                onChange={handleFoodSelect}
                                options={foodOptions}
                                placeholder="Select food..."
                                isSearchable
                                styles={{
                                    control: (base) => ({
                                        ...base,
                                        backgroundColor: "#37474f",
                                        borderColor: "#00c853",
                                        color: "white"
                                    }),
                                    menu: (base) => ({
                                        ...base,
                                        backgroundColor: "#2f343d",
                                        color: "white"
                                    }),
                                    singleValue: (base) => ({
                                        ...base,
                                        color: "white"
                                    }),
                                    input: (base) => ({
                                        ...base,
                                        color: "white"
                                    })
                                }}
                            />
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}

export default UserPage;
