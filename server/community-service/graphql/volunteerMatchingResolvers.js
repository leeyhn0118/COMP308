import HelpRequest from "../models/HelpRequest.js";
import { fetchUserProfile } from "../utils/fetchUserProfile.js";
import axios from "axios";

const volunteerMatchingResolvers = {
  Query: {
    matchVolunteers: async (_, { helpRequestId }, { user }) => {
      if (!user) {
        throw new Error("You must be logged in");
      }

      try {
        const helpReqRes = await axios.post("http://localhost:4002/graphql", {
          query: `
            query {
              getHelpRequest(id: "${helpRequestId}") {
                id
                description
                location
                author {
                  id
                }
              }
            }
          `
        }, {
          headers: {
            Cookie: `token=${user.token}`
          }
        });

        const helpRequest = helpReqRes.data.data.getHelpRequest;
        if (!helpRequest) throw new Error("Help request not found");

        const requesterProfile = await fetchUserProfile(user.id);
        const requesterLocation = requesterProfile.location;
        const requesterInterests = requesterProfile.interests || [];

        const usersRes = await axios.get("http://localhost:4001/users");
        const users = usersRes.data;

        const matched = users.filter(u =>
          u.id !== helpRequest.author.id &&
          u.role === 'resident' &&
          u.location === requesterLocation &&
          u.interests?.some(interest => requesterInterests.includes(interest))
        );

        return matched;

      } catch (err) {
        console.error("Volunteer matching error:", err.message);
        throw new Error("Failed to match volunteers");
      }
    }
  }
};

export default volunteerMatchingResolvers;
