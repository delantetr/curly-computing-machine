const User = require('../models/User');
const Thought = require('../models/Thought');

module.exports = {
    async getAllUsers(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getSingleUser(req, res) {
        try {
            const user = await User.findById(req.params.userId)
                .populate('thoughts')
                .populate('friends');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async createUser(req, res) {
        try {
            const user = await User.create(req.body);
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async updateUser(req, res) {
        try {
            const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async deleteUser(req, res) {
        try {
            const user = await User.findByIdAndRemove(req.params.userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            await Thought.deleteMany({ username: user.username });
            res.json({ message: 'User and associated thoughts deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async addFriend(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            const friend = await User.findById(req.params.friendId);
            if (!user || !friend) {
                return res.status(404).json({ message: 'User or friend not found' });
            }
            user.friends.push(friend._id);
            await user.save();
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async removeFriend(req, res) {
        try {
            const user = await User.findById(req.params.userId);
            const friendIndex = user.friends.indexOf(req.params.friendId);
            if (friendIndex === -1) {
                return res.status(404).json({ message: 'Friend not found in user\'s friend list' });
            }
            user.friends.splice(friendIndex, 1);
            await user.save();
            res.json(user);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
