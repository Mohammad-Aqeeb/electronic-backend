const logger = require("../config/logger");
const trackMyOrder = require("../model/TrackOrder");

const TrackOrderController = {
    getOrderTracking : async (req, res) => {
        try {
            const { orderId } = req.params;

            const tracking = await trackMyOrder.find({ order_id: orderId })
            .sort({ changeAt: 1 }) // Oldest to newest
            .populate('changeBy', 'name') // Populate name of user who changed status

            if (!tracking || tracking.length === 0) {
                return res.status(404).json({
                    success : false,
                    message: 'No tracking info found for this order'
                });
            }

            res.status(200).json({
                success : true,
                message : "Tracking info fetched",
                data : tracking
            });
        } catch (error) {
            console.error('Error fetching tracking:', error);
            res.status(500).json({ message: 'Server error' });
        }
    },

    updateOrderStatus : async (req, res) => {
        try{
            const { orderId } = req.params;
            const { status, userType } = req.body;
            const userId = req.user.id; // from auth middleware

            const validStatuses = ["Pending", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered", "Cancelled"];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success : false,
                    message: 'Invalid status value'
                });
            }

            const newTracking = new trackMyOrder({
                order_id: orderId,
                order_status: status,
                changeBy: userId,
                userType,
            });

            await newTracking.save();

            res.status(200).json({
                success : true,
                message: 'Order status updated successfully'
            });

        } catch (error) {
            logger.error(error);
            res.status(500).json({
                success : false,
                message: 'Server error',
                error : error.message
            });
        }
    }
}

module.exports = TrackOrderController;