import { Box, Button, Paper, Typography } from "@mui/material";

export default function MealSection({ title, meals, onAdd }) {
  return (
    <Paper
      variant="outlined"
      sx={{ p: "0.75rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}
    >
      <Typography variant="subtitle1" fontWeight="bold">
        {title}
      </Typography>

      <Button
        type="button"
        variant="outlined"
        size="small"
        onClick={onAdd}
        sx={{ alignSelf: "flex-start" }}
      >
        Add {title}
      </Button>

      {meals.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No items yet
        </Typography>
      ) : (
        <Box sx={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {meals.map((meal, index) => (
            <Typography key={meal.id} variant="body2">
              {index + 1}. {meal.name || `${title} meal`}
            </Typography>
          ))}
        </Box>
      )}
    </Paper>
  );
}
