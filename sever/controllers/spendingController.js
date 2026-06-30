const PantryItem = require('../models/PantryItem');
const User = require('../models/User');

// GET /api/spending  — monthly cost breakdown for all household members
const getSpending = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // If no household, just show the current user's spending
    const householdId = user.householdId || req.user.id;

    // Get all household members
    const members = await User.find({ householdId }).select('name email');

    // For each member, sum their item costs this month
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const breakdown = await Promise.all(
      members.map(async (member) => {
        const items = await PantryItem.find({
          userId: member._id,
          createdAt: { $gte: startOfMonth },
        });
        const total = items.reduce((sum, item) => sum + (item.cost || 0), 0);
        return { memberId: member._id, name: member.name, email: member.email, total };
      })
    );

    // Also include the current user if not in a household
    if (!user.householdId) {
      const items = await PantryItem.find({
        userId: req.user.id,
        createdAt: { $gte: startOfMonth },
      });
      const total = items.reduce((sum, item) => sum + (item.cost || 0), 0);
      return res.json([{ memberId: req.user.id, name: user.name, email: user.email, total }]);
    }

    res.json(breakdown);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// GET /api/spending/export  — download spending as CSV
const exportCSV = async (req, res) => {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const items = await PantryItem.find({
      userId: req.user.id,
      createdAt: { $gte: startOfMonth },
    });

    // Build CSV rows
    const csvRows = ['Item Name,Quantity,Unit,Cost (₹),Purchase Date'];
    items.forEach(item => {
      const date = new Date(item.purchaseDate).toLocaleDateString();
      csvRows.push(`${item.name},${item.quantity},${item.unit},${item.cost},${date}`);
    });

    const csv = csvRows.join('\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="spending.csv"');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// POST /api/spending/invite  — invite a household member by email
const inviteMember = async (req, res) => {
  const { email } = req.body;
  try {
    const invitedUser = await User.findOne({ email });
    if (!invitedUser) {
      return res.status(404).json({ message: 'No user found with that email' });
    }

    // Add them to the same household as the inviter
    const currentUser = await User.findById(req.user.id);
    const householdId = currentUser.householdId || currentUser._id;

    // Update inviter's householdId if not already set
    if (!currentUser.householdId) {
      currentUser.householdId = householdId;
      await currentUser.save();
    }

    invitedUser.householdId = householdId;
    await invitedUser.save();

    res.json({ message: `${invitedUser.name} added to your household` });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { getSpending, exportCSV, inviteMember };
