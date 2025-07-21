import { User } from "../models/user.models.js";
import { Submission } from "../models/submissions.model.js";

export const updateUserStats = async (userId,  isAccepted) => {
  console.log(req.user?._id)
  const user = await User.findById(req.user?._id);
  if (!user) return;

  user.totalSubmissions += 1;
  if (isAccepted) {
    user.acceptedSubmissions += 1;

    const alreadySolved = await Submission.exists({
      user: userId,
      isAccepted: true,
    });

    if (!alreadySolved) {
      user.problemsSolved += 1;
    }
  }

  await user.save();
};
