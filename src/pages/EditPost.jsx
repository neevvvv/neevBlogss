import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PostForm from "../components/post-form/PostForm";
import appService from "../appwrite/service";

export default function EditPost() {
  const { slug } = useParams();
  const [existing, setExisting] = useState(null);
  useEffect(() => {
    appService.getPostBySlug(slug).then(setExisting);
  }, [slug]);
  if (!existing) return <p>Loading…</p>;
  return <PostForm existing={existing} />;
}
