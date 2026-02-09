import { BrowserRouter, Routes, Route } from "react-router";
import { CookiesProvider } from "react-cookie";
import { Toaster } from "sonner";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/Signup";

import Recipes from "./pages/Recipes";
import RecipeAdd from "./pages/RecipeAdd";
import RecipeEdit from "./pages/RecipeEdit";
import RecipeDetails from "./pages/RecipeDetails";

function App() {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <Routes>
          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/*  Recipes */}
          <Route path="/" element={<Recipes />} />
          <Route path="/recipes" element={<Recipes />} />
          <Route path="/recipes/new" element={<RecipeAdd />} />
          <Route path="/recipes/:id" element={<RecipeDetails />} />
          <Route path="/recipes/:id/edit" element={<RecipeEdit />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </CookiesProvider>
  );
}

export default App;
