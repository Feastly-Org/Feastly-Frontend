import { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Typography,
} from "@mui/material";
import MealSection from "../components/MealSection";

const MEAL_SECTIONS = [
  {
    key: "breakfast",
    title: "Breakfast",
    description: "Start the day with your first meal.",
  },
  {
    key: "lunch",
    title: "Lunch",
    description: "Track your midday meals and quick bites.",
  },
  {
    key: "dinner",
    title: "Dinner",
    description: "Keep your evening meals in one place.",
  },
  {
    key: "snacks",
    title: "Snacks",
    description: "Log everything in between the main meals.",
  },
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

function createEmptyDayMeals() {
  return {
    breakfast: [],
    lunch: [],
    dinner: [],
    snacks: [],
  };
}

function formatDateKey(date) {
  return date.toISOString().split("T")[0];
}

function getStartOfWeek(dateString) {
  const date = new Date(`${dateString}T12:00:00`);
  const dayOfWeek = date.getDay();
  const offset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

  date.setDate(date.getDate() + offset);

  return date;
}

function buildWeekDays(dateString) {
  const startOfWeek = getStartOfWeek(dateString);

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + index);

    return {
      key: formatDateKey(date),
      label: date.toLocaleDateString("en-US", { weekday: "long" }),
      shortDate: date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
    };
  });
}

export default function DailyLogPage() {
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [weeklyMeals, setWeeklyMeals] = useState({});
  const [savedMeals] = useState(SAVED_MEALS);
  const [activeSelection, setActiveSelection] = useState(null);

  const weekDays = buildWeekDays(selectedDate);

  const handleOpenMealPicker = (dateKey, mealType) => {
    setActiveSelection({ dateKey, mealType });
  };

  const handleCloseMealPicker = () => {
    setActiveSelection(null);
  };

  const handleSelectMeal = (dateKey, mealType, meal) => {
    setWeeklyMeals((currentMeals) => {
      const mealsForDay = currentMeals[dateKey] ?? createEmptyDayMeals();

      return {
        ...currentMeals,
        [dateKey]: {
          ...mealsForDay,
          [mealType]: [
            ...mealsForDay[mealType],
            {
              id: `${meal.id}-${Date.now()}`,
              name: meal.name,
            },
          ],
        },
      };
    });

    handleCloseMealPicker();
  };

  const activeSection = MEAL_SECTIONS.find(
    (section) => section.key === activeSelection?.mealType,
  );
  const activeDay = weekDays.find(
    (day) => day.key === activeSelection?.dateKey,
  );
  const selectableMeals = savedMeals.filter(
    (meal) => meal.mealType === activeSelection?.mealType,
  );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        minHeight: "100vh",
        py: "3rem",
        px: "1rem",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: "90rem",
          gap: "1.5rem",
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{ textAlign: "center" }}
          >
            Daily Log
          </Typography>
          <Typography sx={{ textAlign: "center" }}>
            Build your whole week from Monday through Sunday. Each day has its
            own breakfast, lunch, dinner, and snacks log.
          </Typography>
        </Box>

        <Paper
          elevation={1}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "space-between",
            alignItems: { xs: "flex-start", sm: "center" },
            gap: "1rem",
            p: "1rem",
          }}
        >
          <Box>
            <Typography variant="h6" fontWeight="bold">
              Select Any Date In The Week
            </Typography>
            <Typography variant="body2" color="text.secondary">
              The week view updates automatically from Monday through Sunday.
            </Typography>
          </Box>
          <Box
            component="input"
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            sx={{
              font: "inherit",
              padding: "0.75rem",
              borderRadius: "4px",
              border: "1px solid",
              borderColor: "divider",
            }}
          />
        </Paper>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "repeat(7, minmax(180px, 1fr))",
            gap: "1rem",
            alignItems: "start",
            overflowX: "auto",
          }}
        >
        {weekDays.map((day) => {
          const mealsForDay = weeklyMeals[day.key] ?? createEmptyDayMeals();

          return (
            <Paper
              key={day.key}
              elevation={1}
              sx={{
                minWidth: "180px",
                p: "1rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  {day.label}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {day.shortDate}
                </Typography>
              </Box>

              {MEAL_SECTIONS.map((section) => (
                <MealSection
                  key={`${day.key}-${section.key}`}
                  title={section.title}
                  meals={mealsForDay[section.key]}
                  onAdd={() => handleOpenMealPicker(day.key, section.key)}
                />
              ))}
            </Paper>
          );
        })}
        </Box>

      {activeSection && activeDay ? (
        <Dialog open onClose={handleCloseMealPicker} fullWidth maxWidth="sm">
          <DialogTitle>
            <Typography variant="h6" fontWeight="bold">
              Select a {activeSection.title} Meal for {activeDay.label}
            </Typography>
          </DialogTitle>
          <DialogContent dividers>
            <Typography sx={{ mb: "1rem" }} color="text.secondary">
              {activeDay.shortDate}. {activeSection.description}
            </Typography>

          {selectableMeals.length === 0 ? (
            <Typography>
              No saved {activeSection.title.toLowerCase()} meals yet.
            </Typography>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {selectableMeals.map((meal) => (
                <Box key={meal.id}>
                  <Button
                    type="button"
                    variant="outlined"
                    fullWidth
                    onClick={() =>
                      handleSelectMeal(activeDay.key, activeSection.key, meal)
                    }
                  >
                    {meal.name}
                  </Button>
                </Box>
              ))}
            </Box>
          )}
          </DialogContent>
          <DialogActions>
            <Button type="button" onClick={handleCloseMealPicker}>
              Close
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
      </Box>
    </Box>
  );
}
