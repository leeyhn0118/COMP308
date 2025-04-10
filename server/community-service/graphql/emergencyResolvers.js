import EmergencyAlert from "../models/EmergencyAlert.js";

const emergencyResolvers = {
    Query: {
        getAllEmergencyAlert: async () => {
            try {
                return await EmergencyAlert.find().sort({ createAt: -1});
            } catch (err) {
                console.error('Error fetching emergency alerts', err);
                throw new Error('Failed to fetch emergency alerts');
            }
        },
        getEmergencyAlert: async (__dirname, { id }) => {
            try {
                return await EmergencyAlert.findById(id);
            } catch (err) {
                console.error('Error fetching emergency alerts by ID', err);
                throw new Error('Failed to fetch emergency alerts by ID');
            }
        }
    },

    Mutation: {
        createEmergencyAlert: async (_, {title, message, location}, {user}) => {
            if (!user) {
                throw new Error('You must be logged in first')
            }

            try {
                const newAlert = new EmergencyAlert({
                    author: user.id,
                    title,
                    message,
                    location
                });
                await newAlert.save();
                return newAlert;
            } catch (err) {
                console.error('Error creating emergency alert:', err);
                throw new Error('Failed to create emergency alert');
            }
        },

        updateEmergencyAlert: async (_, {id, title, message, location, isResolved }, {user}) => {
            if (!user) {
                throw new Error('You must be logged in first')
            }

            try {
                const alert = await EmergencyAlert.findById(id);
                if (!alert) throw new Error('Alert not found');
                if (alert.author.toString() != user.id) {
                    throw new Error ('You are not allowed to update this alert')
                }

                alert.title = title || alert.title;
                alert.message = message || alert.message;
                alert.location = location || alert.location;
                alert.isResolved = isResolved !== undefined ? isResolved : alert.isResolved;
                alert.updatedAt = Date.now();

                await alert.save();
                return alert;
              } catch (err) {
                console.error('Error updating emergency alert:', err);
                throw new Error('Failed to update emergency alert');
              }
            },
        deleteEmergencyAlert: async (_, { id }, { user }) => {
            if (!user) {
                throw new Error('You must be logged in to delete an alert');
            }

            try {
                const alert = await EmergencyAlert.findById(id);
                if (!alert) throw new Error('Alert not found');
                if (alert.author.toString() !== user.id) {
                throw new Error('You can only delete your own alerts');
                }

                await alert.remove();
                return true;
              } catch (err) {
                console.error('Error deleting emergency alert.:', err);
                throw new Error('Failed to delete emergency alert');
              }
        }
    }
};

export default emergencyResolvers;