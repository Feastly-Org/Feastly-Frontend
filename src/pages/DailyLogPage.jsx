import { useState } from "react";
import MealSection from "../components/MealSection";

const MEAL_SECTIONS = [
  { key: "breakfast", title: "Breakfast", description: "Start the day with your first meal." },
  { key: "lunch", title: "Lunch", description: "Track your midday meals and quick bites." },
  { key: "dinner", title: "Dinner", description: "Keep your evening meals in one place." },
  { key: "snacks", title: "Snacks", description: "Log everything in between the main meals." },
];

export default function DailyLogPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );

  const [dailyMeals, setDailyMeals] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  });

  const handleAddMeal = (mealType) => {
    setDailyMeals((currentMeals) => {
      const nextMealNumber = currentMeals[mealType].length + 1;

      return {
        ...currentMeals,
        [mealType]: [
          ...currentMeals[mealType],
          {
            id: `${mealType}-${Date.now()}`,
            name: `${mealType.charAt(0).toUpperCase() + mealType.slice(1)} item ${nextMealNumber}`,
          },
        ],
      };
    });
  };

  return (
    <div>
      <section>
        <div>
          <h1>Daily Log</h1>
          <p>
            Build your day meal by meal. Each section keeps breakfast, lunch,
            dinner, and snacks separate so the log stays easy to scan.
          </p>
        </div>

        <label>
          <span>Select Date</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
        </label>
      </section>

      <section>
        {MEAL_SECTIONS.map((section) => (
          <MealSection
            key={section.key}
            title={section.title}
            meals={dailyMeals[section.key]}
            onAdd={() => handleAddMeal(section.key)}
          />
        ))}
      </section>
    </div>
  );
}
