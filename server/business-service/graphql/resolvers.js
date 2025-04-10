import Business from '../models/Business.js';
import Deal from '../models/Deal.js';
import Review from '../models/Review.js';
import Comment from '../models/Comment.js';

const resolvers = {
  Query: {
    getAllBusinesses: async () => await Business.find().sort({ createdAt: -1 }),
    getBusinessById: async (_, { id }) => await Business.findById(id),
    getDealsByBusiness: async (_, { businessId }) => await Deal.find({ businessId }).sort({ createdAt: -1 }),
    getReviewsByBusiness: async (_, { businessId }) => await Review.find({ businessId }).sort({ createdAt: -1 }),
    getCommentsByReview: async (_, { reviewId }) => await Comment.find({ reviewId }).sort({ createdAt: -1 }),
  },

  Mutation: {
    createBusiness: async (_, { name, description, image, category }, { user }) => {
      if (!user || user.role !== 'business_owner') throw new Error('Only business owners can create businesses.');
      return await new Business({ ownerId: user.id, name, description, image, category }).save();
    },

    updateBusiness: async (_, { id, name, description, image, category }, { user }) => {
      const business = await Business.findById(id);
      if (!business) throw new Error('Business not found');
      if (business.ownerId.toString() !== user.id) throw new Error('Not authorized');
      Object.assign(business, { name, description, image, category });
      return await business.save();
    },

    deleteBusiness: async (_, { id }, { user }) => {
      const business = await Business.findById(id);
      if (!business || business.ownerId.toString() !== user.id) throw new Error('Not authorized');
      await business.deleteOne();
      return true;
    },

    createDeal: async (_, { businessId, title, description, discount, expiresAt }, { user }) => {
      const business = await Business.findById(businessId);
      if (!business || business.ownerId.toString() !== user.id) throw new Error('Not authorized');
      return await new Deal({ businessId, title, description, discount, expiresAt }).save();
    },

    deleteDeal: async (_, { id }, { user }) => {
      const deal = await Deal.findById(id);
      const business = await Business.findById(deal.businessId);
      if (!deal || !business || business.ownerId.toString() !== user.id) throw new Error('Not authorized');
      await deal.deleteOne();
      return true;
    },

    createReview: async (_, { businessId, content, rating }, { user }) => {
      if (!user) throw new Error('Login required');
      return await new Review({ businessId, reviewerId: user.id, content, rating }).save();
    },

    deleteReview: async (_, { id }, { user }) => {
      const review = await Review.findById(id);
      if (!review || review.reviewerId.toString() !== user.id) throw new Error('Not authorized');
      await review.deleteOne();
      return true;
    },

    createComment: async (_, { reviewId, content }, { user }) => {
      if (!user || user.role !== 'business_owner') throw new Error('Only business owners can comment');
      return await new Comment({ reviewId, authorId: user.id, content }).save();
    },

    updateComment: async (_, { id, content }, { user }) => {
      const comment = await Comment.findById(id);
      if (!comment || comment.authorId.toString() !== user.id) throw new Error('Not authorized');
      comment.content = content;
      comment.updatedAt = Date.now();
      return await comment.save();
    },

    deleteComment: async (_, { id }, { user }) => {
      const comment = await Comment.findById(id);
      if (!comment || comment.authorId.toString() !== user.id) throw new Error('Not authorized');
      await comment.deleteOne();
      return true;
    },
  },
};

export default resolvers;
