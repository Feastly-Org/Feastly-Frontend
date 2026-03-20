import { useState } from "react";
import MealSection from "../components/MealSection";

const MEAL_SECTIONS = [
  { key: "breakfast", title: "Breakfast", description: "Start the day with your first meal." },
  { key: "lunch", title: "Lunch", description: "Track your midday meals and quick bites." },
  { key: "dinner", title: "Dinner", description: "Keep your evening meals in one place." },
  { key: "snacks", title: "Snacks", description: "Log everything in between the main meals." },
];

const SAVED_MEALS = [
  { id: "meal-1", name: "Greek Yogurt Bowl", mealType: "breakfast" },
  { id: "meal-2", name: "Avocado Toast", mealType: "breakfast" },
  { id: "meal-3", name: "Chicken Caesar Wrap", mealType: "lunch" },
  { id: "meal-4", name: "Turkey Sandwich", mealType: "lunch" },
  { id: "meal-5", name: "Salmon and Rice", mealType: "dinner" },
  { id: "meal-6", name: "Pasta Primavera", mealType: "dinner" },
  { id: "meal-7", name: "Protein Bar", mealType: "snacks" },
  { id: "meal-8", name: "Apple with Peanut Butter", mealType: "snacks" },
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
  const [savedMeals] = useState(SAVED_MEALS);
  const [activeMealType, setActiveMealType] = useState(null);

  const handleOpenMealPicker = (mealType) => {
    setActiveMealType(mealType);
  };

  const handleCloseMealPicker = () => {
    setActiveMealType(null);
  };

  const handleSelectMeal = (mealType, meal) => {
    setDailyMeals((currentMeals) => {
      return {
        ...currentMeals,
        [mealType]: [
          ...currentMeals[mealType],
          {
            id: `${meal.id}-${Date.now()}`,
            name: meal.name,
          },
        ],
      };
    });

    handleCloseMealPicker();
  };

  const activeSection = MEAL_SECTIONS.find((section) => section.key === activeMealType);
  const selectableMeals = savedMeals.filter((meal) => meal.mealType === activeMealType);

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
            onAdd={() => handleOpenMealPicker(section.key)}
          />
        ))}
      </section>

      {activeSection ? (
        <section>
          <div>
            <h2>Select a {activeSection.title} Meal</h2>
            <p>{activeSection.description}</p>
            <button type="button" onClick={handleCloseMealPicker}>
              Close
            </button>
          </div>

          {selectableMeals.length === 0 ? (
            <p>No saved {activeSection.title.toLowerCase()} meals yet.</p>
          ) : (
            <div>
              {selectableMeals.map((meal) => (
                <button
                  key={meal.id}
                  type="button"
                  onClick={() => handleSelectMeal(activeSection.key, meal)}
                >
                  {meal.name}
                </button>
              ))}
            </div>
          )}
        </section>
      ) : null}
    </div>
  );
}
