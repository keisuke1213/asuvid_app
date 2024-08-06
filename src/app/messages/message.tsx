"use client"
import { useState, useEffect } from 'react';
import axios from 'axios';
import FullCalendar from '@fullcalendar/react';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';

type eventsType = {
  title: string;
  start: string;
  id: string;
};

export const ScheduleMessage = () => {
  const [message, setMessage] = useState('');
  const [sendTime, setSendTime] = useState('');
  const [groupId, setGroupId] = useState('');
  const [events, setEvents] = useState<eventsType[]>([]);
  const [step, setStep] = useState(1);
  const [tempEvent, setTempEvent] = useState<eventsType | null>(null);

  useEffect(() => {
    const fetchGroupId = async () => {
      const res = await axios.get('/api/groups');
      if (res.data.length > 0) {
        setGroupId(res.data[0].groupId);
      }
    };
    fetchGroupId();
  }, []);

  const handleDateClick = (arg: any) => {
    const dateStr = arg.dateStr;
    const msg = prompt('Enter your message:');
    if (msg) {
      const timeStr = prompt('Enter the time in HH:MM format:', '12:00');
      if (timeStr) {
        const dateTimeStr = `${dateStr}T${timeStr}:00`;
        setTempEvent({ title: msg, start: dateTimeStr, id: dateTimeStr });
        setMessage(msg);
        setSendTime(dateTimeStr);
        setStep(2);
      }
    }
  };

  const handleCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/check-message', {
        content: message,
        sendTime,
        groupId, // 役員グループのIDに変更する場合はこの部分を変更
      });
      alert('Message sent to officers for review.');
      setStep(3);
    } catch (error) {
      console.error('Failed to send message to officers:', error);
      alert('Failed to send message to officers.');
    }
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/schedule-message', {
        content: message,
        sendTime,
        groupId,
      });
      setEvents([...events, { title: message, start: sendTime, id: res.data.id }]);
      setMessage('');
      setSendTime('');
      setTempEvent(null);
      setStep(1);
      alert('Message scheduled successfully!');
    } catch (error) {
      console.error('Failed to schedule message:', error);
      alert('Failed to schedule message.');
    }
  };

  return (
    <div>
      <h1>Schedule Message</h1>
      <form onSubmit={step === 2 ? handleCheck : handleSend}>
        {step > 1 && (
          <>
            <p>Message: {message}</p>
            <p>Send Time: {sendTime}</p>
            <button type="submit">{step === 2 ? 'Check' : 'Send'}</button>
          </>
        )}
      </form>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={tempEvent ? [...events, tempEvent] : events}
        dateClick={handleDateClick}
      />
    </div>
  );
};

export default ScheduleMessage;
