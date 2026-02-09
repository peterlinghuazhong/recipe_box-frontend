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
  const navigate = useNavigate();
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  const [title, setTitle] = useState("");
  const [descriptions, setDescriptions] = useState("");
  const [img_url, setImgUrl] = useState("");

  const [ingredients, setIngredients] = useState([
    { name: "", quantity: "", unit: "" },
  ]);
  const [steps, setSteps] = useState([{ instruction_text: "" }]);

  const handleSubmit = async () => {
    let valid = true;

    if (!title) valid = false;
    if (!descriptions) valid = false;
    if (!img_url) valid = false;

    for (let i = 0; i < ingredients.length; i++) {
      if (!ingredients[i].name) valid = false;
      if (!ingredients[i].quantity) valid = false;
      if (!ingredients[i].unit) valid = false;
    }

    for (let i = 0; i < steps.length; i++) {
      if (!steps[i].instruction_text) valid = false;
    }

    if (!valid) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const recipe = await addRecipe({ title, descriptions, img_url }, token);

      for (let i = 0; i < ingredients.length; i++) {
        await addIngredient(
          { ...ingredients[i], recipe_id: recipe._id },
          token,
        );
      }

      for (let i = 0; i < steps.length; i++) {
        await addStep({ ...steps[i], recipe_id: recipe._id }, token);
      }

      toast.success("Recipe created successfully!");
      navigate("/recipes");
    } catch (err) {
      console.log(err);
      toast.error("Failed to create recipe.");
    }
  };

  const addIngredientRow = () => {
    setIngredients([...ingredients, { name: "", quantity: "", unit: "" }]);
  };

  const updateIngredient = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const deleteIngredient = (index) => {
    const updated = [];
    for (let i = 0; i < ingredients.length; i++) {
      if (i !== index) {
        updated.push(ingredients[i]);
      }
    }
    setIngredients(updated);
  };

  const addStepRow = () => {
    setSteps([...steps, { instruction_text: "" }]);
  };

  const updateStep = (index, value) => {
    const updated = [...steps];
    updated[index].instruction_text = value;
    setSteps(updated);
  };

  const deleteStep = (index) => {
    const updated = [];
    for (let i = 0; i < steps.length; i++) {
      if (i !== index) {
        updated.push(steps[i]);
      }
    }
    setSteps(updated);
  };

  return (
    <>
      <Header />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Typography variant="h4" align="center" mb={3}>
          Add Recipe
        </Typography>

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
