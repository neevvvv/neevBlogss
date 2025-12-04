import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Button,
  Divider,
  TextField,
} from "@mui/material";
import { Edit, Delete, ThumbUp, ThumbDown } from "@mui/icons-material";
import { useParams, useNavigate } from "react-router-dom";
import authService from "../appwrite/auth";
import appService from "../appwrite/service";

export default function PostDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [userId, setUserId] = useState(null); 
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    (async () => {
      const user = await authService.getCurrentUser();
      setUserId(user?.$id);

      const doc = await appService.getPostBySlug(slug);
      const imageUrl = doc.featuredImage
        ? await appService.getFileView(doc.featuredImage)
        : null;
      const authorImageUrl = doc.authorProfileImage
        ? await appService.getFilePreview(doc.authorProfileImage)
        : null;

      const [upCount, downCount, cs] = await Promise.all([
        appService.countLikes(doc.$id, "up"),
        appService.countLikes(doc.$id, "down"),
        appService.getComments(doc.$id),
      ]);

      const enrichedComments = await Promise.all(
        cs.map(async (c) => ({
          ...c,
          userImageUrl: c.userImage
            ? await appService.getFileView(c.userImage)
            : null,
        }))
      );

      setPost({
        ...doc,
        imageUrl,
        authorImageUrl,
        upvotes: upCount,
        downvotes: downCount,
      });
      setComments(enrichedComments);
    })();
  }, [slug]);

  const handleComment = async (e) => {
    e.preventDefault();
    const user = await authService.getCurrentUser();
    if (!newComment.trim()) return;
    await appService.createComment({
      postId: post.$id,
      userId,
      userName: user.name,
      userImage: user.prefs?.profileImage || null,
      content: newComment.trim(),
    });
    setNewComment("");
    const raw = await appService.getComments(post.$id);
    const enriched = await Promise.all(
      raw.map(async (c) => ({
        ...c,
        userImageUrl: c.userImage
          ? await appService.getFileView(c.userImage)
          : null,
      }))
    );
    setComments(enriched);
  };

  if (!post) return <Box sx={{ pt: 10, textAlign: "center" }}>Loading…</Box>;

  return (
    <Box sx={{ pt: 10, px: 2, maxWidth: 800, mx: "auto" }}>
      {post.imageUrl && (
        <Box
          component="img"
          src={post.imageUrl}
          alt={post.title}
          sx={{ width: "100%", borderRadius: 2, mb: 2 }}
        />
      )}

      <Typography variant="h4" gutterBottom>
        {post.title}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Avatar src={post.authorImageUrl} sx={{ mr: 1 }}>
          {post.authorName?.charAt(0).toUpperCase()}
        </Avatar>
        <Typography variant="subtitle2">
          {post.authorName} • {new Date(post.$createdAt).toLocaleString()}
        </Typography>
      </Box>

      <Box
        dangerouslySetInnerHTML={{ __html: post.content }}
        className="prose"
        sx={{ mb: 4 }}
      />

      <Box sx={{ mb: 3 }}>
        <IconButton
          onClick={async () => {
            await appService.toggleLike(post.$id, userId, "up");
            const [upCount, downCount] = await Promise.all([
              appService.countLikes(post.$id, "up"),
              appService.countLikes(post.$id, "down"),
            ]);
            setPost((p) => ({ ...p, upvotes: upCount, downvotes: downCount }));
          }}
        >
          <ThumbUp /> {post.upvotes}
        </IconButton>
        <IconButton
          onClick={async () => {
            await appService.toggleLike(post.$id, userId, "down");
            const [up, down] = await Promise.all([
              appService.countLikes(post.$id, "up"),
              appService.countLikes(post.$id, "down"),
            ]);
            setPost((p) => ({ ...p, upvotes: up, downvotes: down }));
          }}
        >
          <ThumbDown /> {post.downvotes}
        </IconButton>
      </Box>

      {post.userid === userId && (
        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/edit-post/${slug}`)}
          >
            Edit
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={async () => {
              if (window.confirm("Delete this post?")) {
                await appService.deletePost(post.$id);
                navigate("/all-posts");
              }
            }}
          >
            Delete
          </Button>
        </Box>
      )}

      <Divider sx={{ my: 4 }} />

      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>

      <Box component="form" onSubmit={handleComment} sx={{ mb: 2 }}>
        <TextField
          fullWidth
          multiline
          minRows={2}
          placeholder="Write a comment…"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <Button type="submit" variant="contained" sx={{ mt: 1 }}>
          Post Comment
        </Button>
      </Box>

      {comments.map((c) => (
        <Box key={c.$id} sx={{ display: "flex", mb: 2 }}>
          <Avatar src={c.userImageUrl} sx={{ width: 32, height: 32, mr: 1 }}>
            {c.userName?.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="subtitle2">
              {c.userName} • {new Date(c.createdAt).toLocaleString()}
            </Typography>
            <Typography variant="body2">{c.content}</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
