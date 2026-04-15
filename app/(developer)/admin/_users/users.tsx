"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import BanAppeals from "./_helpers/banappeals";
import UserList from "./_helpers/userlist";
import UserReports from "./_helpers/userreports";

const Users = () => {
  return (
    <div className="space-y-6 text-start">
      <Card className="m-2 p-2">
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>A list of all registered users and their current status.</CardDescription>
        </CardHeader>
        <CardContent>
          <UserList />
        </CardContent>
      </Card>

      <Card className="m-2 p-2">
        <CardHeader>
          <CardTitle>Ban Appeals</CardTitle>
          <CardDescription>
            Review ban appeals submitted by banned users. Unresolved appeals are shown first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <BanAppeals />
        </CardContent>
      </Card>

      <Card className="m-2 p-2">
        <CardHeader>
          <CardTitle>User Reports</CardTitle>
          <CardDescription>
            Review reports submitted against users. Unresolved reports are shown first.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <UserReports />
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;
