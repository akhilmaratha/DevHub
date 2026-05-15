"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { X, Users } from "lucide-react";

export default function FollowersModal({ username, type = "followers", count = 0 }) {
  const [open, setOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleOpen = async () => {
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch(`/api/users/${username}/followers?type=${type}`);
      const data = await res.json();
      setUsers(data.users || []);
    } catch {} finally { setLoading(false); }
  };

  return (
    <>
      <button onClick={handleOpen} className="cursor-pointer text-left">
        <span className="text-[13px] text-zinc-400 hover:text-zinc-200 transition-colors">
          <span className="font-semibold text-zinc-200">{count}</span> {type}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60" onClick={() => setOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.15 }} className="relative bg-surface border border-border rounded-lg w-full max-w-sm max-h-[70vh] overflow-hidden z-10">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <h3 className="text-[14px] font-medium text-zinc-200 capitalize">{type}</h3>
                <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-zinc-300 cursor-pointer"><X className="w-4 h-4" /></button>
              </div>
              <div className="overflow-y-auto max-h-[55vh]">
                {loading ? (
                  <div className="p-4 space-y-3">
                    {[1, 2, 3].map((i) => (<div key={i} className="flex items-center gap-3"><div className="w-8 h-8 skeleton rounded-md shrink-0" /><div className="flex-1 space-y-1.5"><div className="h-3 skeleton rounded w-1/2" /><div className="h-2.5 skeleton rounded w-1/3" /></div></div>))}
                  </div>
                ) : users.length === 0 ? (
                  <div className="p-8 text-center"><Users className="w-5 h-5 text-zinc-600 mx-auto mb-2" /><p className="text-[13px] text-zinc-500">No {type} yet.</p></div>
                ) : (
                  <div className="divide-y divide-border">
                    {users.map((u) => (
                      <Link key={u._id} href={`/profile/${u.username}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-3 hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                        <div className="w-8 h-8 rounded-md bg-card-hover border border-border flex items-center justify-center text-[11px] font-semibold text-zinc-300 shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[13px] font-medium text-zinc-200 truncate">{u.name}</p>
                          <p className="text-[11px] text-zinc-500 truncate">@{u.username}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
