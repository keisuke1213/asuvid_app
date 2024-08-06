import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'GET') {
    const groups = await prisma.group.findMany();
    res.status(200).json(groups);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
