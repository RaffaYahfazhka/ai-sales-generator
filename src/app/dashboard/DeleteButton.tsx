"use client";

import { Loader2, Trash2 } from "lucide-react";
import { deleteSalesPage } from "./actions";
import { useState } from "react";

export default function DeleteButton({ id }: { id: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this sales page?")) return;
    
    setIsDeleting(true);
    try {
      await deleteSalesPage(id);
    } catch (err) {
      alert("Failed to delete page");
      setIsDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50 hover:shadow-lg hover:shadow-red-500/20"
      title="Delete page"
    >
      {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}
