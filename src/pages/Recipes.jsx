import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  Typography,
  Chip,
} from "@mui/material";
import Header from "../components/Header";
import { getRecipes, deleteRecipe } from "../utils/api_recipe";
import { useCookies } from "react-cookie";
import Swal from "sweetalert2";
import { toast } from "sonner";

const Recipes = () => {
  const navigate = useNavigate(); // for redirect
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "" } = currentuser;

  const [recipes, setRecipes] = useState([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      toast.error("You must sign up in first");
      navigate("/signup"); // redirect to  sign up page
    }
  }, [token, navigate]);

  // Fetch all recipes
  useEffect(() => {
    if (token) fetchRecipes();
  }, [token]);

  const fetchRecipes = async () => {
    try {
      const data = await getRecipes();
      setRecipes(data);
    } catch (err) {
      console.log("Failed to fetch recipes:", err);
      toast.error("Failed to fetch recipes");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete this recipe?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteRecipe(id, token);
        toast.success("Recipe deleted");
        fetchRecipes();
      } catch (err) {
        toast.error("Failed to delete recipe");
      }
    }
  };

  return (
    <>
      <Header current="home" />
      <Container sx={{ mt: 4 }}>
        {/* Header and Add Button */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            Recipes Box
          </Typography>
          <Button component={Link} to="/recipes/new" variant="contained">
            Add New Recipe
          </Button>
        </Box>

        {/* Recipe Cards */}
        <Grid container spacing={4}>
          {recipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {recipe.title}
                  </Typography>

                  <Typography variant="body2">
                    {recipe.descriptions.length > 100
                      ? recipe.descriptions.slice(0, 100) + "..."
                      : recipe.descriptions}
                  </Typography>

                  {/* Display Image URL */}
                  {recipe.img_url && (
                    <Typography
                      variant="body2"
                      color="primary"
                      sx={{ mt: 1, wordBreak: "break-word" }}
                    >
                      URL: {recipe.img_url}
                    </Typography>
                  )}

                  {/* User Name and Date */}
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mt: 2,
                    }}
                  >
                    <Chip
                      label={recipe.created_by?.name || "Unknown"}
                      color="primary"
                      size="small"
                    />
                    <Chip
                      label={
                        recipe.createdAt
                          ? new Date(recipe.createdAt).toLocaleDateString()
                          : "No date"
                      }
                      color="success"
                      size="small"
                    />
                  </Box>
                </CardContent>

                {/* Action Buttons */}
                <CardActions sx={{ px: 2, pb: 2 }}>
                  <Button
                    component={Link}
                    to={`/recipes/${recipe._id}`}
                    variant="contained"
                    size="small"
                    fullWidth
                  >
                    View
                  </Button>

                  {(currentuser.role === "admin" ||
                    recipe.created_by?._id === currentuser._id) && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 1,
                        mt: 1,
                        width: "100%",
                      }}
                    >
                      <Button
                        component={Link}
                        to={`/recipes/${recipe._id}/edit`}
                        variant="outlined"
                        size="small"
                        fullWidth
                      >
                        Edit
                      </Button>

                      {currentuser.role === "admin" && (
                        <Button
                          color="error"
                          variant="outlined"
                          size="small"
                          fullWidth
                          onClick={() => handleDelete(recipe._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </Box>
                  )}
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {recipes.length === 0 && (
          <Typography align="center" mt={4}>
            No recipes found.
          </Typography>
        )}
      </Container>
    </>
  );
};

export default Recipes;
