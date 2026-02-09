import Header from "../components/Header";
import { Container, Typography, Paper, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRecipe } from "../utils/api_recipe";
import { getIngredients } from "../utils/api_ingredient";
import { getSteps } from "../utils/api_recipestep";
import RecipeComments from "../components/RecipeComments";
const RecipeDetails = () => {
  const { id } = useParams(); // Get recipe ID from URL
  const navigate = useNavigate();

  const [recipe, setRecipe] = useState({});
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipe, ingredients, and steps
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const r = await getRecipe(id); // Get recipe details
        setRecipe(r);

        const ing = await getIngredients(id); // Get ingredients
        setIngredients(ing);

        const st = await getSteps(id); // Get steps
        setSteps(st);
      } catch (err) {
        console.log("Error fetching recipe details:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  if (loading)
    return (
      <Typography align="center" mt={5}>
        Loading...
      </Typography>
    );

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
        {/* Recipe Title */}
        <Typography variant="h4" align="center" mb={3}>
          {recipe.title}
        </Typography>

        {/* Recipe Description */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Description</Typography>
          <Typography>{recipe.descriptions}</Typography>
        </Paper>

        {/* Image URL as Text */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Image URL</Typography>
          <Typography>
            {recipe.image_url ? recipe.image_url : "No image URL provided"}
          </Typography>
        </Paper>

        {/* Ingredients */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Ingredients</Typography>
          {ingredients.length > 0 ? (
            ingredients.map((ing) => (
              <Typography key={ing._id}>
                {ing.name} - Quantitiy:{ing.quantity} Unit:{ing.unit}
              </Typography>
            ))
          ) : (
            <Typography>No ingredients added</Typography>
          )}
        </Paper>

        {/* Steps */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6">Steps</Typography>
          {steps.length > 0 ? (
            steps.map((st, idx) => (
              <Typography key={st._id}>
                Step {idx + 1}: {st.instruction_text}
              </Typography>
            ))
          ) : (
            <Typography>No steps added</Typography>
          )}
        </Paper>

        {/* Comments Section */}
        <RecipeComments recipeId={id} recipeOwnerId={recipe.created_by?._id} />

        {/* Back Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={() => navigate("/recipes")}
        >
          Back
        </Button>
      </Container>
    </>
  );
};

export default RecipeDetails;
