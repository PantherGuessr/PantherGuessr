"use client"

import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableRow } from "@/components/ui/table";
import Image from "next/image";

const Levels = () => {

    const tableData = [
        {
            _creationTime: 1728505858956.4575,
            _id: "j573vcsaxrs5ksfk25z3hnm67572a6dk",
            imageId: "kg2bqzmy32ehahhhd0wts64fz572a60s",
            latitude: 33.792789,
            longitude: -117.852065,
            title: "Sunset Over Starbucks Outside Seating",
          },
          {
            _creationTime: 1728505858956.4578,
            _id: "j57akmevqrx32f4j2pxaam7z8972b8yb",
            imageId: "kg24d0675cpg7twpc2dnwek8rd72aegv",
            latitude: 33.793108,
            longitude: -117.851864,
            title: "Walk to Leatherby Libraries",
          }
    ];

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableCell>Title</TableCell>
                        <TableCell>ID</TableCell>
                        <TableCell>ImageID</TableCell>
                        <TableCell>Latitude</TableCell>
                        <TableCell>Longitude</TableCell>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {tableData.map((row) => (
                        <TableRow key={row._id}>
                            <TableCell>{row.title}</TableCell>
                            <TableCell>{row._id}</TableCell>
                            <TableCell className="flex flex-col justify-items-center align-middle">
                                <Button onClick={() => alert("pop up an image later")}>
                                    {row.imageId}
                                </Button>
                            </TableCell>
                            <TableCell>{row.latitude}</TableCell>
                            <TableCell>{row.longitude}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default Levels;