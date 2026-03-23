import { Box, Button, Paper, Typography } from "@mui/material";

export default function MealSection({ title, meals, onAdd, onDelete }) {
  return (
    <Paper variant="outlined" sx={{ p: 1.5 }}>
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>

      <Button type="button" variant="outlined" size="small" onClick={onAdd}>
        Add {title}
      </Button>

      {meals.length === 0 ? (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          No items yet
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
          {meals.map((meal, index) => (
            <Paper key={meal.id} variant="outlined" sx={{ p: 1 }}>
              <Typography variant="body2">
                {index + 1}. {meal.name || `${title} meal`}
              </Typography>

              {meal.ingredients?.length ? (
                <Typography variant="caption" color="text.secondary">
                  Ingredients:{" "}
                  {meal.ingredients
                    .map((ingredient) => ingredient.name)
                    .join(", ")}
                </Typography>
              ) : null}

              {onDelete ? (
                <Button
                  type="button"
                  color="error"
                  size="small"
                  onClick={() => onDelete(meal)}
                  sx={{ mt: 1 }}
                >
                  Delete
                </Button>
              ) : null}
            </Paper>
          ))}
        </Box>
      )}
    </Paper>
  );
}
