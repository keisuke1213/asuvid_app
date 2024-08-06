import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const LINE_CHANNEL_ACCESS_TOKEN = process.env.LINE_CHANNEL_ACCESS_TOKEN;

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { content, sendTime, officerGroupId } = req.body;

    try {
      await axios.post('https://api.line.me/v2/bot/message/push', {
        to: officerGroupId,
        messages: [{ type: 'text', text: `内容を確認してください:\n${content}\n送信日時: ${sendTime}` }],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${LINE_CHANNEL_ACCESS_TOKEN}`,
        },
      });

      return res.status(200).json({ message: 'Message sent to officers for review' });
    } catch (error) {
      console.error('Failed to send message to officer group:', error);
      return res.status(500).json({ error: 'Failed to send message to officer group' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
};
