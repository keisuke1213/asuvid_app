import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const events = req.body.events;

    for (const event of events) {
      if (event.type === 'memberJoined' && event.source.type === 'group') {
        const groupId = event.source.groupId;

        // グループIDをデータベースに保存
        await prisma.group.create({
          data: {
            groupId: groupId,
          },
        });

        console.log(`Group ID: ${groupId}`);
      }
    }

    res.status(200).send('OK');
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
