import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import Header from "../components/Header";
import { toast } from "sonner";
import { useCookies } from "react-cookie";

import { getRecipe, updateRecipe } from "../utils/api_recipe";
import {
  getIngredients,
  addIngredient,
  updateIngredient,
  deleteIngredient,
} from "../utils/api_ingredient";
import {
  getSteps,
  addStep,
  updateStep,
  deleteStep,
} from "../utils/api_recipestep";

const RecipeEdit = () => {
  // Get recipe ID from URL
  const { id } = useParams();

  // Used to go to another page after saving
  const navigate = useNavigate();

  // Get user info from cookies
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", role = "" } = currentuser;

  // State for recipe fields
  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [image_url, setImageUrl] = useState("");
  const [ingredients, setIngredients] = useState([]);
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);

  // Run when page loads or when ID changes
  useEffect(() => {
    loadData();
  }, [id]);

  // 🔹 This function loads recipe, ingredients, and steps from backend
  const loadData = async () => {
    try {
      // Get recipe info
      const recipe = await getRecipe(id);
      setTitle(recipe.title || "");
      setDescriptions(recipe.descriptions || "");
      setImageUrl(recipe.image_url || "");

      // Get ingredients
      const ing = await getIngredients(id);
      if (ing.length > 0) {
        setIngredients(ing);
      } else {
        setIngredients([{ name: "", quantity: "", unit: "" }]);
      }

      // Get steps
      const st = await getSteps(id);
      if (st.length > 0) {
        setSteps(st);
      } else {
        setSteps([{ instruction_text: "" }]);
      }
    } catch (err) {
      toast.error("Failed to load recipe");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 This function checks if all fields are filled
  const isFormValid = () => {
    if (!title || !descriptions) return false;

    if (ingredients.length === 0) return false;
    for (let i = 0; i < ingredients.length; i++) {
      const ing = ingredients[i];
      if (!ing.name || ing.quantity === "" || !ing.unit) {
        return false;
      }
    }

    if (steps.length === 0) return false;
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      if (!step.instruction_text) {
        return false;
      }
    }

    return true;
  };

  // 🔹 This function runs when user clicks "Save Changes"
  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // Update recipe info
      await updateRecipe(id, { title, descriptions, image_url }, token);

      // Update or add ingredients
      for (let i = 0; i < ingredients.length; i++) {
        const ing = ingredients[i];
        if (ing._id) {
          await updateIngredient(ing._id, ing, token);
        } else {
          await addIngredient({ ...ing, recipe_id: id }, token);
        }
      }

      // Update or add steps
      for (let i = 0; i < steps.length; i++) {
        const step = steps[i];
        if (step._id) {
          await updateStep(step._id, step, token);
        } else {
          await addStep({ ...step, recipe_id: id }, token);
        }
      }

      toast.success("Recipe updated successfully!");
      navigate("/recipes");
    } catch (err) {
      toast.error("Failed to update recipe.");
      console.log(err);
    }
  };

  // 🔹 Add a new empty ingredient row
  const addNewIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  // 🔹 Update a specific ingredient field
  const updateIngredientField = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // 🔹 Remove an ingredient (and delete from backend if exists)
  const removeIngredient = (index) => {
    const ingToDelete = ingredients[index];
    if (ingToDelete._id) {
      deleteIngredient(ingToDelete._id, token);
    }

    const newIngredients = [];
    for (let i = 0; i < ingredients.length; i++) {
      if (i !== index) {
        newIngredients.push(ingredients[i]);
      }
    }
    setIngredients(newIngredients);
  };

  // 🔹 Add a new empty step
  const addNewStep = () => {
    setSteps([...steps, { instruction_text: "" }]);
  };

  // 🔹 Update a specific step text
  const updateStepField = (index, value) => {
    const newSteps = [...steps];
    newSteps[index].instruction_text = value;
    setSteps(newSteps);
  };

  // 🔹 Remove a step (and delete from backend if exists)
  const removeStep = (index) => {
    const stepToDelete = steps[index];
    if (stepToDelete._id) {
      deleteStep(stepToDelete._id, token);
    }

    const newSteps = [];
    for (let i = 0; i < steps.length; i++) {
      if (i !== index) {
        newSteps.push(steps[i]);
      }
    }
    setSteps(newSteps);
  };

  // Show loading text while data is being fetched
  if (loading) {
    return (
      <Typography align="center" mt={5}>
        Loading...
      </Typography>
    );
  }

  return (
    <>
      <Header />
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" align="center" mb={3}>
          Edit Recipe
        </Typography>

        {/* Recipe Info */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" mb={2}>
            Recipe Info
          </Typography>

          <TextField
            label="Title"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={descriptions}
            onChange={(e) => setDescriptions(e.target.value)}
            sx={{ mb: 2 }}
          />

          <TextField
            label="Image URL"
            fullWidth
            value={image_url}
            onChange={(e) => setImageUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Paper>

        {/* Ingredients */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" mb={2}>
            Ingredients
          </Typography>

          {ingredients.map((ing, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                label="Name"
                value={ing.name}
                onChange={(e) =>
                  updateIngredientField(index, "name", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Quantity"
                value={ing.quantity}
                onChange={(e) =>
                  updateIngredientField(index, "quantity", e.target.value)
                }
                fullWidth
              />
              <TextField
                label="Unit"
                value={ing.unit}
                onChange={(e) =>
                  updateIngredientField(index, "unit", e.target.value)
                }
                fullWidth
              />
              {role === "admin" && (
                <IconButton
                  onClick={() => removeIngredient(index)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}

          <Button variant="outlined" onClick={addNewIngredient}>
            + Add Ingredient
          </Button>
        </Paper>

        {/* Steps */}
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" mb={2}>
            Steps
          </Typography>

          {steps.map((step, index) => (
            <Box key={index} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                label={`Step ${index + 1}`}
                value={step.instruction_text}
                onChange={(e) => updateStepField(index, e.target.value)}
                fullWidth
                multiline
              />
              {role === "admin" && (
                <IconButton onClick={() => removeStep(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          ))}

          <Button variant="outlined" onClick={addNewStep}>
            + Add Step
          </Button>
        </Paper>

        {/* Save Button */}
        <Button
          variant="contained"
          fullWidth
          onClick={handleSubmit}
          disabled={!isFormValid()}
        >
          Save Changes
        </Button>
      </Container>
    </>
  );
};

export default RecipeEdit;
