import Event from '../models/Event.js';

const eventResolvers = {
  Query: {
    getAllEvents: async () => {
      return await Event.find().sort({ startTime: 1 });
    },
    getEventById: async (_, { id }) => {
      return await Event.findById(id);
    },
    recommendBestEventTiming: async () => {
      return await recommendEventTiming();
    },
  },

  Mutation: {
    createEvent: async (_, { title, description, location, startTime, endTime }, { user }) => {
      if (!user || user.role !== 'community_organizer') {
        throw new Error('Only community organizers can create events.');
      }

      const newEvent = new Event({
        title,
        description,
        location,
        startTime,
        endTime,
        organizerId: user.id,
      });

      return await newEvent.save();
    },

    updateEvent: async (_, { id, title, description, location, startTime, endTime }, { user }) => {
      const event = await Event.findById(id);
      if (!event) throw new Error('Event not found');
      if (event.organizerId.toString() !== user.id) {
        throw new Error('You are not authorized to update this event.');
      }

      event.title = title ?? event.title;
      event.description = description ?? event.description;
      event.location = location ?? event.location;
      event.startTime = startTime ?? event.startTime;
      event.endTime = endTime ?? event.endTime;

      return await event.save();
    },

    deleteEvent: async (_, { id }, { user }) => {
      const event = await Event.findById(id);
      if (!event) throw new Error('Event not found');
      if (event.organizerId.toString() !== user.id) {
        throw new Error('You are not authorized to delete this event.');
      }

      await event.deleteOne();
      return true;
    },

    joinEvent: async (_, { id }, { user }) => {
      if (!user) throw new Error('Login required to join event.');

      const event = await Event.findById(id);
      if (!event) throw new Error('Event not found');

      if (!event.attendees.includes(user.id)) {
        event.attendees.push(user.id);
        await event.save();
      }

      return event;
    },

    leaveEvent: async (_, { id }, { user }) => {
      if (!user) throw new Error('Login required to leave event.');

      const event = await Event.findById(id);
      if (!event) throw new Error('Event not found');

      event.attendees = event.attendees.filter((attendeeId) => attendeeId.toString() !== user.id);
      await event.save();

      return event;
    },
  },
};

export default eventResolvers;
