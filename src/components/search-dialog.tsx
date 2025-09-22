import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";

export function SearchDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ id: string; title: string }[]>([]);
  const [loading, setLoading] = useState(false);

  // fetch on query change
  useEffect(() => {
    const fetchChats = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setLoading(true);
      try {
        const res = await fetch("/api/chat-search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: query }),
        });
        const data = await res.json();
        setResults(data.chats || []);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(fetchChats, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Search Chats</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Type to search chats..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          autoFocus
        />
        <div className="mt-3 max-h-60 overflow-y-auto">
          {loading && (
            <p className="text-muted-foreground text-sm">Searching...</p>
          )}
          {!loading && results.length === 0 && query && (
            <p className="text-muted-foreground text-sm">No chats found</p>
          )}
          <ul className="space-y-1">
            {results.map((chat) => (
              <li key={chat.id}>
                <Link
                  href={`/chat/${chat.id}`}
                  className="block rounded px-2 py-1 hover:bg-zinc-800"
                  onClick={() => onOpenChange(false)}
                >
                  {chat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </DialogContent>
    </Dialog>
  );
}
