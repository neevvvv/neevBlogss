import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";
import slugify from "slugify";
import { useNavigate } from "react-router-dom";
import authService from "../../appwrite/auth";
import appService from "../../appwrite/service";
import RTE from "../RTE";

export default function PostForm({ existing = null }) {
  const nav = useNavigate();

  const [title, setTitle] = useState(existing?.title || "");
  const [content, setContent] = useState(existing?.content || "");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (existing) setFile(null);
  }, [existing]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const user = await authService.getCurrentUser();
      const userId = user.$id;
      const authorName = user.name;
      const authorProfileImage = user.prefs?.profileImage || null;
      const slug =
        existing?.slug || slugify(title, { lower: true, strict: true });

      let featuredImage = existing?.featuredImage || null;
      if (file) featuredImage = await appService.uploadFile(file);

      const payload = {
        title,
        content,
        featuredImage,
        slug,
        userid: userId,
        authorName,
        authorProfileImage,
        status: "active",
        upvotes: existing?.upvotes || 0,
        downvotes: existing?.downvotes || 0,
      };

      if (existing) {
        await appService.updatePost(existing.$id, payload);
        nav("/all-posts");
      } else {
        await appService.createPost(payload);
        nav(`/post/${slug}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 800,
        mx: "auto",
        mt: 4,
        p: 3,
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 2,
      }}
    >
      <Typography variant="h5" gutterBottom>
        {existing ? "Edit Post" : "Create New Post"}
      </Typography>

      <TextField
        label="Title"
        fullWidth
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 3 }}
      />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Content
        </Typography>
        <RTE value={content} onChange={setContent} label={false} />
      </Box>

      <Box sx={{ mb: 4, display: "flex", alignItems: "center" }}>
        <Avatar
          src={file ? URL.createObjectURL(file) : existing?.featuredImageUrl}
          variant="rounded"
          sx={{ width: 80, height: 80, mr: 2 }}
        >
          {!file &&
            !existing?.featuredImageUrl &&
            title.charAt(0).toUpperCase()}
        </Avatar>
        <Button variant="contained" component="label">
          {existing ? "Replace Image" : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={(e) => setFile(e.target.files[0] || null)}
          />
        </Button>
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        disabled={
          busy || !title.trim() || !content.trim() || (!existing && !file)
        }
      >
        {busy
          ? existing
            ? "Updating…"
            : "Posting…"
          : existing
          ? "Update Post"
          : "Create Post"}
      </Button>
    </Box>
  );
}
