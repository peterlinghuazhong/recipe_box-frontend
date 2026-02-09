import Header from "../components/Header";
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
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useCookies } from "react-cookie";

import { addRecipe } from "../utils/api_recipe";
import { addIngredient } from "../utils/api_ingredient";
import { addStep } from "../utils/api_recipestep";

const RecipeAdd = () => {
  // Used to go to another page after saving
  const navigate = useNavigate();

  // Get user info from cookies
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  // Recipe basic info
  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [img_url, setImgUrl] = useState("");

  // Ingredients list (start with one empty ingredient)
  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);

  // Steps list (start with one empty step)
  const [steps, setSteps] = useState([{ instruction_text: "" }]);

  // ============================
  // SUBMIT RECIPE
  // ============================
  const handleSubmit = async () => {
    let valid = true;

    // Check recipe fields
    if (!title) valid = false;
    if (!descriptions) valid = false;
    if (!img_url) valid = false;

    // Check all ingredients
    for (let i = 0; i < ingredients.length; i++) {
      if (!ingredients[i].name) valid = false;
      if (!ingredients[i].quantity) valid = false;
      if (!ingredients[i].unit) valid = false;
    }

    // Check all steps
    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].instruction_text) valid = false;
    }

    // If any field is missing, stop and show error
    if (!valid) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      // 1️⃣ Create the recipe
      const recipe = await addRecipe({ title, descriptions, img_url }, token);

      // 2️⃣ Save each ingredient
      for (let i = 0; i < ingredients.length; i++) {
        await addIngredient(
          { ...ingredients[i], recipe_id: recipe._id },
          token,
        );
      }

      // 3️⃣ Save each step
      for (let i = 0; i < steps.length; i++) {
        await addStep({ ...steps[i], recipe_id: recipe._id }, token);
      }

      // Success message and go to recipe list
      toast.success("Recipe created successfully!");
      navigate("/recipes");
    } catch (err) {
      console.log(err);
      toast.error("Failed to create recipe.");
    }
  };

  // ============================
  // INGREDIENT FUNCTIONS
  // ============================

  // Add a new empty ingredient row
  const addIngredientRow = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  // Update one field of one ingredient
  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  // Delete one ingredient by index
  const deleteIngredient = (index) => {
    const updated = [];
    for (let i = 0; i < ingredients.length; i++) {
      if (i !== index) {
        updated.push(ingredients[i]);
      }
    }
    setIngredients(updated);
  };

  // ============================
  // STEP FUNCTIONS
  // ============================

  // Add a new empty step row
  const addStepRow = () => {
    setSteps([...steps, { instruction_text: "" }]);
  };

  // Update one step text
  const updateStep = (index, value) => {
    const updated = [...steps];
    updated[index].instruction_text = value;
    setSteps(updated);
  };

  // Delete one step by index
  const deleteStep = (index) => {
    const updated = [];
    for (let i = 0; i < steps.length; i++) {
      if (i !== index) {
        updated.push(steps[i]);
      }
    }
    setSteps(updated);
  };

  // ============================
  // UI
  // ============================

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" mb={3}>
          Add Recipe
        </Typography>

        {/* RECIPE INFO */}
        <Paper sx={{ p: 3, mb: 3 }}>
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
            value={img_url}
            onChange={(e) => setImgUrl(e.target.value)}
            sx={{ mb: 2 }}
          />
        </Paper>

        {/* INGREDIENTS */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" mb={2}>
            Ingredients
          </Typography>
          {ingredients.map((ing, idx) => (
            <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                label="Name"
                value={ing.name}
                fullWidth
                onChange={(e) => updateIngredient(idx, "name", e.target.value)}
              />
              <TextField
                label="Quantity"
                value={ing.quantity}
                fullWidth
                onChange={(e) =>
                  updateIngredient(idx, "quantity", e.target.value)
                }
              />
              <TextField
                label="Unit"
                value={ing.unit}
                fullWidth
                onChange={(e) => updateIngredient(idx, "unit", e.target.value)}
              />
              <IconButton color="error" onClick={() => deleteIngredient(idx)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button onClick={addIngredientRow}>+ Add Ingredient</Button>
        </Paper>

        {/* STEPS */}
        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="h6" mb={2}>
            Steps
          </Typography>
          {steps.map((st, idx) => (
            <Box key={idx} sx={{ display: "flex", gap: 1, mb: 1 }}>
              <TextField
                label={`Step ${idx + 1}`}
                value={st.instruction_text}
                fullWidth
                multiline
                onChange={(e) => updateStep(idx, e.target.value)}
              />
              <IconButton color="error" onClick={() => deleteStep(idx)}>
                <DeleteIcon />
              </IconButton>
            </Box>
          ))}
          <Button onClick={addStepRow}>+ Add Step</Button>
        </Paper>

        <Button variant="contained" fullWidth onClick={handleSubmit}>
          Submit Recipe
        </Button>
      </Container>
    </>
  );
};

export default RecipeAdd;
