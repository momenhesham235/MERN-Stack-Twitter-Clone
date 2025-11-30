import asyncHandler from "express-async-handler";
import Notification from "../models/notification.model.js";
import STATUS from "../utils/http.status.text.js";

/**---------------------------------------
 * @desc    Get all notifications
 * @route    /api/v1/notifications
 * @method   GET
 * @access   Protected
 ------------------------------------*/
export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ to: req.user._id })
    .sort({
      createdAt: -1,
    })
    .populate({
      path: "from",
      select: "username profileImg",
    });

  await Notification.updateMany({ to: req.user._id }, { read: true });

  res.status(200).json({
    status: STATUS.SUCCESS,
    message: "Notifications fetched successfully",
    data: notifications,
  });
});

/**---------------------------------------
 * @desc     delete notifications
 * @route    /api/v1/notifications
 * @method   DELETE
 * @access   Protected
 ------------------------------------*/
export const deleteNotifications = asyncHandler(async (req, res) => {
  await Notification.deleteMany({ to: req.user._id });
  res.status(200).json({
    status: STATUS.SUCCESS,
    message: "Notifications deleted successfully",
  });
});

/**---------------------------------------
 * @desc    Delete a notification
 * @route    /api/v1/notifications/:id
 * @method   DELETE
 * @access   Protected
 */
export const deleteNotification = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    return res
      .status(404)
      .json({ status: STATUS.FAILURE, message: "Notification not found" });
  }
  if (notification.to.toString() !== req.user._id.toString()) {
    return res.status(401).json({
      status: STATUS.FAILURE,
      message: "You are not authorized to delete this notification",
    });
  }
  await Notification.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({
      status: STATUS.SUCCESS,
      message: "Notification deleted successfully",
    });
});
