import bcrypt, { hash } from "bcrypt"; // For password hashing
import jwt from "jsonwebtoken"; // For JWT token generation
import User from "../models/User.js"; // Import the User model
import { config } from "../config/config.js"; // Import JWT secret from config

const resolvers = {
  User: {
    __resolveReference: async (reference) => {
      return await User.findById(reference.id);
    }
  },

  Query: {
    // Fetch the current authenticated user (this is only valid if token is sent with request)
    currentUser: async (_, __, { user }) => {
      if (!user) {
        throw new Error("Not authenticated");
      }
      return {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      };
    }
  },

  Mutation: {
    // Register a new user
    register: async (_, { username, email, password, role, interests, location }) => {
      // Check if the user already exists by email
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new Error("Email is already in use");
      }

      // Hash the password before saving to the database
      // const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user with the hashed password
      const newUser = new User({
        username,
        email,
        password,
        role,
        interests: interests || [],
        location: location || ""
      });

      // Save the new user to the database
      await newUser.save();

      // Generate a JWT token for the newly created user
      const token = jwt.sign(
        {
          id: newUser._id.toString(),
          role: newUser.role,
          interests: newUser.interests,
          location: newUser.location
        },
        config.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Return the token and user data
      return {
        token,
        user: {
          id: newUser._id.toString(),
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          createdAt: newUser.createdAt.toISOString()
        }
      };
    },

    // Login an existing user
    login: async (_, { email, password }, { res }) => {
      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Invalid credentials");
      }

      // Compare the entered password with the stored password hash
      console.log("Provided password:", password);
      console.log("Stored password hash:", user.password);

      const isMatch = await bcrypt.compare(password, user.password);
      console.log("Password match result:", isMatch);

      if (!isMatch) {
        throw new Error("Invalid credentials");
      }

      // Generate a JWT token for the authenticated user
      const token = jwt.sign(
        {
          id: user._id.toString(),
          username: user.username,
          role: user.role,
          interests: user.interests,
          location: user.location
        },
        config.JWT_SECRET,
        { expiresIn: "1d" }
      );

      // Set the JWT token as a cookie in the response (for client-side handling)
      res.cookie("token", token, {
        httpOnly: true, // Prevents JavaScript access
        // secure: false, // Set to true for production (HTTPS)
        // sameSite: 'None', // Set 'None' if using cross-origin requests
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      console.log("✅ Cookie set in response:", res.getHeaders()["set-cookie"]);
      console.log("✅ Cookie set:", res.getHeaders()["set-cookie"]);

      // Return the token and user data
      return {
        token,
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt.toISOString()
        }
      };
    }
  }
};

export default resolvers;
