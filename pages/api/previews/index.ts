// pages/api/previews/index.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import prisma from "../../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.id) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const userId = session.user.id;

  if (req.method === "GET") {
    const previews = await prisma.preview.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });
    return res.status(200).json(previews);
  }

  if (req.method === "POST") {
    const { title, url } = req.body;
    if (!title || !url) {
      return res.status(400).json({ error: "Missing title or url" });
    }
    const preview = await prisma.preview.create({
      data: {
        title,
        url,
        user: { connect: { id: userId } },
      },
    });
    return res.status(201).json(preview);
  }

  res.setHeader("Allow", ["GET", "POST"]);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
