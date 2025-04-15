import HelpRequest from "../models/HelpRequest.js";

// This resolver handles matching volunteers with help requests
const volunteerMatchingResolvers = {
  Query: {
    // Match volunteers based on a help request
    matchVolunteers: async (_, { helpRequestId }, { user }) => {
      if (!user) {
        throw new Error("You must be logged in to match volunteers");
      }

      try {
        // Find the help request by ID
        const helpRequest = await HelpRequest.findById(helpRequestId);

        if (!helpRequest) {
          throw new Error("Help request not found");
        }

        return [];
      } catch (err) {
        console.error("Error matching volunteers:", err);
        throw new Error("Failed to match volunteers");
      }
    }
  },

  Mutation: {
    // Allow a user to volunteer for a help request
    volunteerForHelpRequest: async (_, { helpRequestId }, { user }) => {
      if (!user) {
        throw new Error("You must be logged in to volunteer");
      }

      // Only allow volunteers and admins to volunteer for help requests
      if (user.role !== "volunteer" && user.role !== "admin") {
        throw new Error("Only volunteers and admins can volunteer for help requests");
      }

      try {
        const helpRequest = await HelpRequest.findById(helpRequestId);

        if (!helpRequest) {
          throw new Error("Help request not found");
        }

        // Check if the user is already a volunteer for this request
        if (helpRequest.volunteers.includes(user.id)) {
          throw new Error("You are already volunteering for this help request");
        }

        // Add the user to the volunteers array
        helpRequest.volunteers.push(user.id);
        await helpRequest.save();

        return helpRequest;
      } catch (err) {
        console.error("Error volunteering for help request:", err);
        throw new Error("Failed to volunteer for help request");
      }
    },

    // Allow a user to withdraw from volunteering
    withdrawFromHelpRequest: async (_, { helpRequestId }, { user }) => {
      if (!user) {
        throw new Error("You must be logged in to withdraw from a help request");
      }

      try {
        const helpRequest = await HelpRequest.findById(helpRequestId);

        if (!helpRequest) {
          throw new Error("Help request not found");
        }

        // Check if the user is a volunteer for this request
        const volunteerIndex = helpRequest.volunteers.indexOf(user.id);
        if (volunteerIndex === -1) {
          throw new Error("You are not volunteering for this help request");
        }

        // Remove the user from the volunteers array
        helpRequest.volunteers.splice(volunteerIndex, 1);
        await helpRequest.save();

        return helpRequest;
      } catch (err) {
        console.error("Error withdrawing from help request:", err);
        throw new Error("Failed to withdraw from help request");
      }
    }
  }
};

export default volunteerMatchingResolvers;
