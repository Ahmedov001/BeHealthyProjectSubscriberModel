import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import UserNavbar from './UserNavbar';

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

    const [dietPrograms, setDietPrograms] = useState([]);
    const [hasSubscription, setHasSubscription] = useState(false);

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

    useEffect(() => {
        const token = sessionStorage.getItem('token');

        axios.get('https://localhost:7148/api/User/my-diet-programs', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.data.length > 0) {
                    setDietPrograms(res.data);
                    setHasSubscription(true);
                }
            })
            .catch(err => {
                console.log("No subscription or error loading programs:", err);
                setHasSubscription(false);
            });
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
        <>
            <UserNavbar />
            
            <div style={{ backgroundColor: '#2f343d' }} className="min-vh-100 text-white px-3 px-md-5 py-4">
                <div className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <h4 className="fw-bold text-light">📘 Food Diary</h4>
                        <div>
                            <span className="me-2">🔥 Calories:</span>
                            <strong className="text-warning">{totals.calories.toFixed(0)} kcal</strong>
                        </div>
                    </div>
                    <p className="mb-0">
                        <small>
                            Fat: {totals.fat.toFixed(1)}g | Carbs: {totals.carbs.toFixed(1)}g | Protein: {totals.protein.toFixed(1)}g | Sugar: {totals.sugar.toFixed(1)}g
                        </small>
                    </p>
                </div>

                 {hasSubscription && (
                    <div className="mb-4 p-4 rounded-4 shadow" style={{ backgroundColor: '#3a4049' }}>
                        <h5 className="mb-3 fw-bold text-success">📋 Your Subscribed Diet Programs</h5>
                        {dietPrograms.map((program, index) => (
                            <div key={index} className="mb-3">
                                <h6 className="fw-bold text-info">🎯 Goal: {program.goal}</h6>
                                {program.meals.map((meal, idx) => (
                                    <div key={idx} className="mb-2">
                                        <strong className="text-warning">{meal.mealType}</strong>
                                        <ul className="list-group list-group-flush">
                                            {meal.items.map((item, i) => (
                                                <li key={i} className="list-group-item bg-transparent text-white px-0 py-1">
                                                    🍽 {item.name} – {item.quantity} {item.unit}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                                <hr className="border-secondary" />
                            </div>
                        ))}
                    </div>
                )}

                {userProfile && (
                    <div className="mb-4 p-4 rounded-4 shadow" style={{ backgroundColor: '#3a4049' }}>
                        <h5 className="mb-3 fw-bold text-info">🧠 Daily Recommendations</h5>
                        <p className="mb-1">
                            🔥 <strong>Suggested Calories:</strong> <span className="text-warning">{recommendations.dailyCalories} kcal</span>
                        </p>
                        <p className="mb-0">
                            💧 <strong>Water Intake:</strong> <span className="text-primary">{(recommendations.waterMl / 1000).toFixed(2)} L</span>
                        </p>
                    </div>
                )}

                {meals.map((meal, index) => (
                    <div key={index} className="p-3 mb-4 rounded-3 shadow-sm" style={{ backgroundColor: '#3a4049' }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <div className="d-flex align-items-center">
                                <i className={`bi ${meal.icon} me-2`} style={{ color: meal.color, fontSize: '1.4rem' }}></i>
                                <h6 className="mb-0 text-light">{meal.name}</h6>
                            </div>
                            <button className="btn btn-sm btn-outline-success" onClick={() => handleAddClick(meal.name)}>
                                <i className="bi bi-plus-circle me-1"></i> Add
                            </button>
                        </div>

                        <ul className="list-group list-group-flush">
                            {mealFoods[meal.name].map((food, i) => (
                                <li key={i} className="list-group-item bg-transparent text-white d-flex justify-content-between align-items-center px-0">
                                    <span>{food.name} – {food.calories} kcal</span>
                                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveFood(meal.name, i)}>x</button>
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
        </>
    );
}

export default UserPage;
