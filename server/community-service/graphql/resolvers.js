import CommunityPost from '../models/CommunityPost.js';
import HelpRequest from '../models/HelpRequest.js';

const resolvers = {
    Query: {
        // Get all community posts
        getAllCommunityPosts: async () => {
            try {
                return await CommunityPost.find();  // Fetch posts without trying to populate the 'author'
            } catch (err) {
                console.error('Error fetching community posts:', err);
                throw new Error('Failed to fetch community posts');
            }
        },
        // Get a specific community post by ID
        getCommunityPost: async (_, { id }) => {
            try {
                return await CommunityPost.findById(id);  // Fetch a single post by ID
            } catch (err) {
                console.error('Error fetching community post by ID:', err);
                throw new Error('Community post not found');
            }
        },
        getAllHelpRequests: async () => {
            try {
              return await HelpRequest.find()
            } catch (err) {
              console.error('Error fetching help requests:', err);
              throw new Error('Failed to fetch help requests');
            }
          },
          getHelpRequest: async (_, { id }) => {
            try {
              return await HelpRequest.findById(id)
            } catch (err) {
              console.error('Error fetching help request by ID:', err);
              throw new Error('Help request not found');
            }
          },
    },
    Mutation: {
        // Create a new community post
        createCommunityPost: async (_, { title, content, category, aiSummary }, { user }) => {
            if (!user) {
                throw new Error('You must be logged in to create a post');
            }

            if (user.role !== 'resident') {
                throw new Error('Only residents can create community posts')
            }

            try {
                const newPost = new CommunityPost({
                    author: user.id,  // Store only the userId, don't populate
                    title,
                    content,
                    category,
                    aiSummary,
                });
                await newPost.save();
                return newPost;
            } catch (err) {
                console.error('Error creating community post:', err);
                throw new Error('Failed to create community post');
            }
        },
        // Update an existing community post
        updateCommunityPost: async (_, { id, title, content, category, aiSummary }, { user }) => {
            if (!user) {
                throw new Error('You must be logged in to update a post');
            }

            try {
                const post = await CommunityPost.findById(id);

                if (!post) {
                    throw new Error('Community post not found');
                }

                // Only the author of the post can update it
                if (post.author.toString() !== user.id) {
                    throw new Error('You can only update your own posts');
                }

                post.title = title || post.title;
                post.content = content || post.content;
                post.category = category || post.category;
                post.aiSummary = aiSummary || post.aiSummary;
                post.updatedAt = Date.now();

                await post.save();
                return post;
            } catch (err) {
                console.error('Error updating community post:', err);
                throw new Error('Failed to update community post');
            }
        },
        // Delete a community post
        deleteCommunityPost: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error('You must be logged in to delete a post');
            }

            try {
                const post = await CommunityPost.findById(id);

                if (!post) {
                    throw new Error('Community post not found');
                }

                // Only the author of the post can delete it
                if (post.author.toString() !== user.id) {
                    throw new Error('You can only delete your own posts');
                }

                await post.remove();
                return true; // Return true if the post is successfully deleted
            } catch (err) {
                console.error('Error deleting community post:', err);
                throw new Error('Failed to delete community post');
            }
        },
        createHelpRequest: async (_, { description, location }, { user }) => {
            if (!user) {
                throw new Error('You must be logged in to create a help request');
            }
            
            if (user.role !== 'resident') {
                throw new Error('Only residents can create a help request')
            }

            try {
                const newHelpRequest = new HelpRequest({
                    author: user.id,  // Ensure the logged-in user's ID is passed here
                    description,
                    location,
                });
        
                await newHelpRequest.save();
                return newHelpRequest;
            } catch (err) {
                console.error('Error creating help request:', err);
                throw new Error('Failed to create help request');
            }
        },
        
        // Update an existing help request
        updateHelpRequest: async (_, { id, description, location, isResolved }, { user }) => {
            if (!user) {
                throw new Error('You must be logged in to update a help request');
            }

            try {
                const helpRequest = await HelpRequest.findById(id);

                if (!helpRequest) {
                    throw new Error('Help request not found');
                }

                // Only the author of the help request can update it
                if (helpRequest.author.toString() !== user.id) {
                    throw new Error('You can only update your own help requests');
                }

                helpRequest.description = description || helpRequest.description;
                helpRequest.location = location || helpRequest.location;
                helpRequest.isResolved = isResolved !== undefined ? isResolved : helpRequest.isResolved;
                helpRequest.updatedAt = Date.now();

                await helpRequest.save();
                return helpRequest;
            } catch (err) {
                console.error('Error updating help request:', err);
                throw new Error('Failed to update help request');
            }
        },
        // Delete a help request
        deleteHelpRequest: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error('You must be logged in to delete a help request');
            }

            try {
                const helpRequest = await HelpRequest.findById(id);

                if (!helpRequest) {
                    throw new Error('Help request not found');
                }

                // Only the author of the help request can delete it
                if (helpRequest.author.toString() !== user.id) {
                    throw new Error('You can only delete your own help requests');
                }

                await helpRequest.remove();
                return true; // Return true if the help request is successfully deleted
            } catch (err) {
                console.error('Error deleting help request:', err);
                throw new Error('Failed to delete help request');
            }
        },
    },
};

export default resolvers;
