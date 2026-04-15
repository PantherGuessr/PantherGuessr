"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "convex/react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { api } from "@/convex/_generated/api";

const ROLE_BADGES: Record<string, { label: string; className: string }> = {
  developer: { label: "Developer", className: "bg-purple-600 text-white hover:bg-purple-600" },
  moderator: { label: "Moderator", className: "bg-blue-600 text-white hover:bg-blue-600" },
  contributor: { label: "Contributor", className: "bg-green-600 text-white hover:bg-green-600" },
  friend: { label: "Friend", className: "bg-pink-500 text-white hover:bg-pink-500" },
  top_player: { label: "Top Player", className: "bg-yellow-500 text-black hover:bg-yellow-500" },
};

const PAGE_SIZE = 20;

const UserList = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const users = useQuery(api.users.getListOfProfiles);

  const filtered =
    users?.filter((u) => u.username.toLowerCase().includes(search.toLowerCase())) ?? [];

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const currentPage = Math.min(page, Math.max(0, totalPages - 1));
  const pageSlice = filtered.slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(0);
  };

  const start = filtered.length === 0 ? 0 : currentPage * PAGE_SIZE + 1;
  const end = Math.min((currentPage + 1) * PAGE_SIZE, filtered.length);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search by username..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="max-w-sm"
        />
        <p className="text-sm text-muted-foreground">{users?.length ?? 0} total users</p>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users === undefined ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  Loading...
                </TableCell>
              </TableRow>
            ) : filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                  No users found.
                </TableCell>
              </TableRow>
            ) : (
              pageSlice.map((user) => (
                <TableRow key={user._id} className={user.isBanned ? "opacity-60" : ""}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user.picture} alt={user.username} />
                        <AvatarFallback>{user.username[0]?.toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <Link
                        href={`/profile/${user.username}`}
                        className="font-medium hover:underline"
                        target="_blank"
                      >
                        @{user.username}
                      </Link>
                    </div>
                  </TableCell>
                  <TableCell>Lv. {String(user.level)}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {(user.roles ?? []).map((role) => {
                        const badge = ROLE_BADGES[role];
                        return badge ? (
                          <Badge key={role} className={badge.className}>
                            {badge.label}
                          </Badge>
                        ) : (
                          <Badge key={role} variant="outline">
                            {role}
                          </Badge>
                        );
                      })}
                    </div>
                  </TableCell>
                  <TableCell>
                    {user.isBanned ? (
                      <Badge variant="destructive">Banned</Badge>
                    ) : (
                      <Badge variant="secondary">Active</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {filtered.length > 0 ? `${start}–${end} of ${filtered.length} users` : ""}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p - 1)}
            disabled={currentPage === 0}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((p) => p + 1)}
            disabled={currentPage >= totalPages - 1}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserList;
