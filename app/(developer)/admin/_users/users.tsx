"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BanAppeals from "./_helpers/banappeals";
import UserList from "./_helpers/userlist";
import UserReports from "./_helpers/userreports";

const Users = () => {
  return (
    <div className="space-y-6 text-start">
      <Card className="m-0 p-0 md:m-2 md:p-2 [&_td]:px-2 [&_td]:py-2 [&_th]:px-2 md:[&_td]:px-4 md:[&_td]:py-4 md:[&_th]:px-4">
        <CardHeader className="px-3 md:px-6">
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users and their current status.</CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <UserList />
        </CardContent>
      </Card>

      <Card className="m-0 p-0 md:m-2 md:p-2 [&_td]:px-2 [&_td]:py-2 [&_th]:px-2 md:[&_td]:px-4 md:[&_td]:py-4 md:[&_th]:px-4">
        <CardHeader className="px-3 md:px-6">
          <CardTitle>Ban Appeals</CardTitle>
          <CardDescription>
            Review ban appeals submitted by banned users. Unresolved appeals are shown first.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <BanAppeals />
        </CardContent>
      </Card>

      <Card className="m-0 p-0 md:m-2 md:p-2 [&_td]:px-2 [&_td]:py-2 [&_th]:px-2 md:[&_td]:px-4 md:[&_td]:py-4 md:[&_th]:px-4">
        <CardHeader className="px-3 md:px-6">
          <CardTitle>User Reports</CardTitle>
          <CardDescription>
            Review reports submitted against users. Unresolved reports are shown first.
          </CardDescription>
        </CardHeader>
        <CardContent className="px-2 md:px-6">
          <UserReports />
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
