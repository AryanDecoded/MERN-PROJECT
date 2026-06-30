const PantryItem = require('../models/PantryItem');
const ShoppingItem = require('../models/ShoppingItem');
const User = require('../models/User');
const nodemailer = require('nodemailer');

// Set up Nodemailer using Gmail SMTP (credentials from .env)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // use an App Password, not your real Gmail password
  },
});

// Called every midnight — finds items expiring in 3 days and emails the user
const checkExpiryAndNotify = async () => {
  try {
    const today = new Date();
    const in3Days = new Date();
    in3Days.setDate(today.getDate() + 3);

    // Find all items expiring soon
    const expiringItems = await PantryItem.find({
      expiryDate: { $gte: today, $lte: in3Days },
    }).populate('userId', 'name email'); // get owner's name and email

    if (expiringItems.length === 0) {
      console.log('No expiring items found today.');
      return;
    }

    // Group items by user so each user gets one email
    const itemsByUser = {};
    expiringItems.forEach(item => {
      const userId = item.userId._id.toString();
      if (!itemsByUser[userId]) {
        itemsByUser[userId] = { user: item.userId, items: [] };
      }
      itemsByUser[userId].items.push(item);
    });

    // Send one email per user
    for (const userId in itemsByUser) {
      const { user, items } = itemsByUser[userId];

      const itemList = items.map(item => {
        const daysLeft = Math.ceil((new Date(item.expiryDate) - today) / (1000 * 60 * 60 * 24));
        return `- ${item.name} (${item.quantity} ${item.unit}) — expires in ${daysLeft} day(s)`;
      }).join('\n');

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: '⚠️ Pantry Tracker — Items Expiring Soon!',
        text: `Hi ${user.name},\n\nThe following items in your pantry are expiring within 3 days:\n\n${itemList}\n\nPlease use them soon to avoid waste!\n\n— Pantry Tracker`,
      });

      console.log(`Expiry email sent to ${user.email}`);
    }
  } catch (error) {
    console.error('Error in checkExpiryAndNotify:', error.message);
  }
};

// Called every midnight — finds items below minThreshold and adds to shopping list
const checkLowStock = async () => {
  try {
    // Find items where quantity has dropped below the minThreshold
    const lowStockItems = await PantryItem.find({
      $expr: { $lt: ['$quantity', '$minThreshold'] },
    });

    for (const item of lowStockItems) {
      // Avoid duplicate entries — don't add if already in the list
      const alreadyAdded = await ShoppingItem.findOne({
        pantryItemId: item._id,
        isChecked: false,
      });

      if (!alreadyAdded) {
        await ShoppingItem.create({
          userId: item.userId,
          name: item.name,
          quantity: item.minThreshold,
          unit: item.unit,
          autoAdded: true,
          pantryItemId: item._id,
        });
        console.log(`Auto-added "${item.name}" to shopping list.`);
      }
    }
  } catch (error) {
    console.error('Error in checkLowStock:', error.message);
  }
};

module.exports = { checkExpiryAndNotify, checkLowStock };
