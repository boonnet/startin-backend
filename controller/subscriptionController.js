const Subscription = require('../model/subscription');
const Course = require('../model/course');
const Template = require('../model/templates');
const Lession = require('../model/lessions');
// Add a new subscription
const addSubscription = async (req, res) => {
  try {
    const { subscription_title, price, validity, description, tax, courses, templates } = req.body;

    // Create Subscription
    const newSubscription = await Subscription.create({
      subscription_title,
      price,
      validity,
      description,
      tax,
    });

    // Update Courses with the Subscription ID
    if (courses && courses.length > 0) {
      await Course.update(
        { subscription_id: newSubscription.id },
        { where: { id: courses } } // Update only selected course IDs
      );
    }

    // Update Templates with the Subscription ID
    if (templates && templates.length > 0) {
      await Template.update(
        { subscription_id: newSubscription.id },
        { where: { id: templates } } // Update only selected template IDs
      );
    }

    res.status(201).json({
      message: 'Subscription added successfully',
      subscription: newSubscription,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error adding subscription', error: error.message });
  }
};

// Get all subscriptions
const getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.findAll();
    res.status(200).json(subscriptions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching subscriptions', error: error.message });
  }
};

// Get a subscription by ID
const getSubscriptionById = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id, {
      include: [
        { model: Course, include: [{ model: Lession }] },
        { model: Template },
      ]
    });
    if (!subscription) {
      return res.status(404).json({ message: "Subscription not found" });
    }
    res.status(200).json(subscription);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subscription", error: error.message });
  }
};


// Edit a subscription
const editSubscription = async (req, res) => {
  try {
    const { id, subscription_title, price, validity, description, tax, courses, templates } = req.body;

    let subscription;

    if (id) {
      // Update existing subscription
      subscription = await Subscription.findByPk(id);
      if (!subscription) {
        return res.status(404).json({ message: "Subscription not found" });
      }

      await subscription.update({
        subscription_title,
        price,
        validity,
        description,
        tax,
      });

      // Clear old associations
      await Course.update({ subscription_id: null }, { where: { subscription_id: id } });
      await Template.update({ subscription_id: null }, { where: { subscription_id: id } });

    } else {
      // Create new subscription
      subscription = await Subscription.create({
        subscription_title,
        price,
        validity,
        description,
        tax,
      });
    }

    // Update Courses with the Subscription ID
    if (courses && courses.length > 0) {
      await Course.update(
        { subscription_id: subscription.id },
        { where: { id: courses } }
      );
    }

    // Update Templates with the Subscription ID
    if (templates && templates.length > 0) {
      await Template.update(
        { subscription_id: subscription.id },
        { where: { id: templates } }
      );
    }

    res.status(200).json({
      message: id ? "Subscription updated successfully" : "Subscription added successfully",
      subscription,
    });

  } catch (error) {
    res.status(500).json({ message: "Error processing subscription", error: error.message });
  }
};


// Delete a subscription
const deleteSubscription = async (req, res) => {
  try {
    const { id } = req.params;
    const subscription = await Subscription.findByPk(id);
    
    if (!subscription) {
      return res.status(404).json({ message: 'Subscription not found' });
    }

    await subscription.destroy();
    res.status(200).json({ message: 'Subscription deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting subscription', error: error.message });
  }
};

module.exports = {
  addSubscription,
  getSubscriptions,
  getSubscriptionById,
  editSubscription,
  deleteSubscription,
};
