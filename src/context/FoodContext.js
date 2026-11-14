import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { foods as seedFoods } from '../data/foods';
import { donors } from '../data/donors';
import { loadJSON, saveJSON, clearAll, STORAGE_KEYS } from '../services/storage';

const FoodContext = createContext(null);

export function FoodProvider({ children }) {
  const [foods, setFoods] = useState([]);
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load data from local storage; seed the dataset on first launch
  useEffect(() => {
    (async () => {
      let storedFoods = await loadJSON(STORAGE_KEYS.foods, null);
      if (!storedFoods) {
        storedFoods = seedFoods;
        await saveJSON(STORAGE_KEYS.foods, seedFoods);
      }
      const storedClaims = await loadJSON(STORAGE_KEYS.claims, []);
      setFoods(storedFoods);
      setClaims(storedClaims);
      setLoading(false);
    })();
  }, []);

  const persist = async (newFoods, newClaims) => {
    setFoods(newFoods);
    setClaims(newClaims);
    await saveJSON(STORAGE_KEYS.foods, newFoods);
    await saveJSON(STORAGE_KEYS.claims, newClaims);
  };

  const getFood = (id) => foods.find((f) => f.id === id);
  const getDonor = (id) => donors.find((d) => d.id === id);

  const claimFood = async (foodId, qty) => {
    const food = getFood(foodId);
    if (!food || qty < 1 || qty > food.quantity) return false;
    const newFoods = foods.map((f) => (f.id === foodId ? { ...f, quantity: f.quantity - qty } : f));
    const newClaim = { id: `c${Date.now()}`, foodId, qty, status: 'Reserved', claimedAt: new Date().toISOString() };
    await persist(newFoods, [newClaim, ...claims]);
    return true;
  };

  const collectClaim = async (claimId) => {
    const newClaims = claims.map((c) => (c.id === claimId ? { ...c, status: 'Collected' } : c));
    await persist(foods, newClaims);
  };

  const cancelClaim = async (claimId) => {
    const claim = claims.find((c) => c.id === claimId);
    if (!claim || claim.status !== 'Reserved') return;
    const newFoods = foods.map((f) => (f.id === claim.foodId ? { ...f, quantity: f.quantity + claim.qty } : f));
    await persist(newFoods, claims.filter((c) => c.id !== claimId));
  };

  const resetData = async () => {
    await clearAll();
    await persist(seedFoods, []);
  };

  // Impact statistics calculated from the user's claims
  const stats = useMemo(() => {
    let items = 0;
    let kg = 0;
    let collected = 0;
    const byCategory = {};
    claims.forEach((c) => {
      const food = foods.find((f) => f.id === c.foodId);
      if (!food) return;
      items += c.qty;
      kg += c.qty * food.kgPerUnit;
      if (c.status === 'Collected') collected += 1;
      byCategory[food.category] = (byCategory[food.category] || 0) + c.qty;
    });
    return { items, kg, co2: kg * 2.5, collected, byCategory };
  }, [claims, foods]);

  const value = { foods, claims, loading, donors, stats, getFood, getDonor, claimFood, collectClaim, cancelClaim, resetData };
  return <FoodContext.Provider value={value}>{children}</FoodContext.Provider>;
}

export const useFood = () => useContext(FoodContext);
