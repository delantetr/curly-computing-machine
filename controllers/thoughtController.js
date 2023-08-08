const Thought = require('../models/Thought'); // Correct the import to use the Thought model

module.exports = {
    async createThought(req, res) {
        try {
            const thought = await Thought.create(req.body);
            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getAllThoughts(req, res) {
        try {
            const thoughts = await Thought.find();
            res.json(thoughts);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async getSingleThought(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async updateThought(req, res) {
        try {
            const thought = await Thought.findByIdAndUpdate(req.params.thoughtId, req.body, { new: true });
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async deleteThought(req, res) {
        try {
            const thought = await Thought.findByIdAndRemove(req.params.thoughtId);
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            res.json({ message: 'Thought deleted' });
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async createReaction(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            thought.reactions.push(req.body);
            await thought.save();
            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },

    async removeReaction(req, res) {
        try {
            const thought = await Thought.findById(req.params.thoughtId);
            if (!thought) {
                return res.status(404).json({ message: 'Thought not found' });
            }
            const reactionId = req.params.reactionId;
            thought.reactions = thought.reactions.filter(reaction => reaction.id !== reactionId);
            await thought.save();
            res.json(thought);
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    },
};
