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
  const [cookies] = useCookies(["currentuser"]);
  const { currentuser = {} } = cookies;
  const { token = "", role = "", _id: userId = "" } = currentuser;

  const [comments, setComments] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    loadComments();
  }, [recipeId]);

  const loadComments = async () => {
    try {
      const data = await fetchComments(recipeId);
      setComments(data);
    } catch (err) {
      console.log("Failed to fetch comments", err);
    }
  };

  const handleSubmit = async () => {
    if (!content.trim()) {
      toast.error("Comment cannot be empty");
      return;
    }

    // Block recipe owner silently
    if (userId === recipeOwnerId) {
      return;
    }

    try {
      await createComment({ recipe_id: recipeId, content }, token);
      toast.success("Comment added!");
      setContent("");
      loadComments();
    } catch (err) {
      toast.error("Failed to add comment");
      console.log(err);
    }
  };

  const handleEdit = async (comment) => {
    if (role !== "admin" && comment.user_id?._id !== userId) return;

    const newContent = prompt("Edit comment:", comment.content);
    if (!newContent) return;

    try {
      await updateComment(comment._id, { content: newContent }, token);
      toast.success("Comment updated!");
      loadComments();
    } catch (err) {
      toast.error("Failed to update comment");
      console.log(err);
    }
  };

  const handleDelete = async (comment) => {
    if (role !== "admin") return;

    try {
      await deleteComment(comment._id, token);
      toast.success("Comment deleted!");
      loadComments();
    } catch (err) {
      toast.error("Failed to delete comment");
      console.log(err);
    }
  };

  const canComment = token && userId !== recipeOwnerId;

  return (
    <Paper sx={{ p: 3, mt: 4 }}>
      <Typography variant="h6" mb={2}>
        Comments
      </Typography>

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
            <Typography variant="subtitle2">
              {comment.user_id?.name || "Unknown"}
            </Typography>
            <Typography variant="body2">{comment.content}</Typography>
            <Typography variant="caption" color="text.secondary">
              {new Date(comment.createdAt).toLocaleString()}
            </Typography>
          </Box>

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

      {/* Comment box */}
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
