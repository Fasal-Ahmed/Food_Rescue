# 🌱 FoodRescue – Smart Food Waste Reduction System

ICA 03 – Individual React Native Project (Expo).

FoodRescue connects people with surplus food from local donors (bakeries, restaurants, shops) so it gets eaten instead of thrown away. The app works **fully offline** – no public APIs or online databases are used.

## Features
- 6 screens with bottom-tab + stack navigation
- Locally created dataset (16 food listings, 6 donors) stored with AsyncStorage
- Search, category filter, dietary filter (Halal / Vegetarian / Vegan) and sorting
- Detailed food view with urgency badge, pickup window and donor info
- Claim food with quantity selection; manage reservations (collect / cancel)
- Impact dashboard: items rescued, kg saved, CO₂ avoided, category chart
- Data persists between app restarts; reset option included

## Screens
| Screen | Purpose |
|---|---|
| Home | Overview, expiring-soon items, category shortcuts |
| Browse | Search, filter and sort all listings |
| Details | Full information and claim action |
| My Rescues | Reserved / collected items |
| Impact | Personal statistics and chart |
| Donors | Donor list with their active listings |

## Project Structure
```
App.js
src/
  components/   SearchBar, CategoryChips, FoodCard
  context/      FoodContext (state + storage logic)
  data/         foods.js, donors.js (local dataset)
  navigation/   AppNavigator.js
  screens/      Home, Browse, Details, Claims, Impact, Donors
  services/     storage.js (AsyncStorage helpers)
  theme.js
```

## Run
```bash
npm install
npx expo install --fix
npx expo start
```
Scan the QR code with Expo Go, or press `a` for the Android emulator.

## Tech
React Native · Expo · React Navigation · AsyncStorage
