import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useCookies } from "react-cookie";
import { toast } from "sonner";
import {
  fetchComments,
  createComment,
  updateComment,
  deleteComment,
} from "../utils/api_comment";

const RecipeComments = ({ recipeId, recipeOwnerId }) => {
  // Get current logged-in user from cookies
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", role = "", _id: userId = "" } = currentuser;

  // State to store comments and input text
  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  // Load comments when the component loads or recipeId changes
  useEffect(() => {
    loadComments();
  }, [recipeId]);

  // 🔹 Get all comments for this recipe from backend
  const loadComments = async () => {
    try {
      const data = await fetchComments(recipeId);
      setComments(data);
    } catch (err) {
      console.log("Failed to fetch comments", err);
    }
  };

  // 🔹 Add a new comment
  const handleSubmit = async () => {
    // Do not allow empty comments
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    // Do not allow recipe owner to comment on their own recipe
    if (userId === recipeOwnerId) {
      return;
    }

    try {
      // Send new comment to backend
      await createComment({ recipe_id: recipeId, content }, token);
      toast.success("Comment added!");
      setContent(""); // Clear input box
      loadComments(); // Refresh comments list
    } catch (err) {
      toast.error("Failed to add comment");
      console.log(err);
    }
  };

  // 🔹 Edit a comment (only admin or comment owner)
  const handleEdit = async (comment) => {
    // Only admin or the user who wrote the comment can edit
    if (role !== "admin" && comment.user_id?._id !== userId) return;

    const newContent = prompt("Edit comment:", comment.content);
    if (!newContent) return;

    try {
      // Send updated comment to backend
      await updateComment(comment._id, { content: newContent }, token);
      toast.success("Comment updated!");
      loadComments(); // Refresh comments list
    } catch (err) {
      toast.error("Failed to update comment");
      console.log(err);
    }
  };

  // 🔹 Delete a comment (only admin)
  const handleDelete = async (comment) => {
    if (role !== "admin") return;

    try {
      // Delete comment from backend
      await deleteComment(comment._id, token);
      toast.success("Comment deleted!");
      loadComments(); // Refresh comments list
    } catch (err) {
      toast.error("Failed to delete comment");
      console.log(err);
    }
  };

  // Check if user is allowed to comment
  const canComment = token && userId !== recipeOwnerId;

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" mb={2}>
        Comments
      </Typography>

      {/* Show all comments */}
      {comments.map((comment) => (
        <Box
          key={comment._id}
          sx={{
            borderBottom: "1px solid #ddd",
            py: 1,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            {/* Show commenter name */}
            <Typography variant="subtitle2">
              {comment.user_id?.name || "Unknown"}
            </Typography>

            {/* Show comment text */}
            <Typography variant="body2">{comment.content}</Typography>

            {/* Show date */}
            <Typography variant="caption" color="text.secondary">
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </Box>

          {/* Edit/Delete buttons */}
          <Box>
            {(role === "admin" || comment.user_id?._id === userId) && (
              <IconButton color="primary" onClick={() => handleEdit(comment)}>
                <EditIcon />
              </IconButton>
            )}
            {role === "admin" && (
              <IconButton color="error" onClick={() => handleDelete(comment)}>
                <DeleteIcon />
              </IconButton>
            )}
          </Box>
        </Box>
      ))}

      {/* Comment input box (only if user can comment) */}
      {token && canComment && (
        <Box sx={{ mt: 2 }}>
          <TextField
            label="Add a comment"
            fullWidth
            multiline
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleSubmit}>
            Submit Comment
          </Button>
        </Box>
      )}
    </Paper>
  );
};

export default RecipeComments;
