import React from "react";
import appwriteService from "../appwrite/service";
import { Link } from "react-router-dom";

function PostCard({ $id, title, featuredImage }) {
  return (
    <Link to={`/post/${$id}`}>
      <div className="w-full shadow-xl hover:shadow-2xl duration-200 bg-soft-cream rounded-xl p-4 transform transition-transform hover:scale-105">
        <div className="w-full justify-center mb-4">
          <img
            src={appwriteService.getFilePreview(featuredImage)}
            alt={title}
            className="rounded-xl"
          />
        </div>
        <h2 className="text-xl hover:text-deep-orange font-bold text-Dark-Brown">
          {title}
        </h2>
      </div>
    </Link>
  );
}

export default PostCard;
